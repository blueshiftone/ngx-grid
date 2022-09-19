import { EMetadataType } from '../../typings/enums'
import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridCellCoordinates, IGridOperationFactory, IGridRow } from '../../typings/interfaces'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { CELL_VALUE_PARSERS } from '../../ui/cell/cell-types/value-parsing'
import { LooksLikeCSV } from '../../utils/looks-like-csv'
import { ParseCSV } from '../../utils/parse-csv'
import { Operation } from '../operation.abstract'

export class GridPaste extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(data: IGridPasteText): void {

    const {gridEvents, dataSource} = this
    if (typeof dataSource === 'undefined') return

    const startCell = this._getStartCell()
    if (!startCell) return

    const endCell = new GridCellCoordinates('', '')

    if (typeof data.html === 'undefined' && typeof data.plainText === 'undefined') return

    const rowData: ICellData[][] = []

    const parseCSV = (text: string) => {
      const results = ParseCSV(text)
      for (const row of results) {
        rowData.push(row.map(val => ({ plainText: val, html: val })))
      }
    }

    const csvData = LooksLikeCSV((data.plainText ?? '').trim()) ? ParseCSV((data.plainText ?? '').trim()) : []

    if (typeof data.html !== 'undefined' && data.html.trim() !== '') {
      const div = document.createElement('div')
      div.innerHTML = data.html
      const body = div.getElementsByTagName('tbody')[0] as HTMLElement | undefined
      if (body && body.tagName.toLowerCase() === 'tbody') {
        let rowIndex = 0
        body.childNodes.forEach(node => {
          if (node.nodeType !== 1) return
          const tr = node as HTMLTableRowElement
          const row: ICellData[] = []
          let colIndex = 0
          tr.childNodes.forEach(td => {
            if (td.nodeType !== 1) return
            const tdEl = td as HTMLElement
            const cellValue = {
              plainText: tdEl.innerText.trim(),
              html     : tdEl.innerHTML
            }
            if (cellValue.plainText.match(/^\#+$/)) cellValue.plainText = cellValue.html = csvData[rowIndex]?.[colIndex] ?? ''
            row.push(cellValue)
            colIndex++
          })
          rowData.push(row)
          rowIndex++
        })
      } else {
        const plainText = data.plainText ?? div.innerText
        if (LooksLikeCSV(plainText.trim())) parseCSV(plainText.trim())
        else rowData.push([{ plainText: plainText, html: data.html }])
      }
    } else if (typeof data.plainText !== 'undefined') {

      if(LooksLikeCSV(data.plainText)) parseCSV(data.plainText)
      else rowData.push([{ plainText: data.plainText }])

    }

    if (rowData.length > 0) {

      // Parse values and ignore column overflow
      const finalValues: any[][] = []
      const columns = this.dataSource.columns
      for (const row of rowData) {
        let startColumn = startCell.columnKey
        let colIndex = columns.findIndex(c => c.columnKey === startColumn)
        let finalRow: any[] = []
        for (const cellValue of row) {
          if (typeof columns[colIndex] === 'undefined') continue
          const column = columns[colIndex]
          const type       = column.type?.name ?? 'Text'
          const validation = CELL_VALUE_PARSERS[type].validate(type === 'RichText' ? (cellValue.html ?? cellValue.plainText) : cellValue.plainText, this.cellOperations.gridController, { columnKey: column.columnKey })
          if (validation.isInvalid) finalRow.push(null)
          else finalRow.push(validation.transformedValue)
          colIndex++
        }
        finalValues.push(finalRow)
      }

      const visibleRows = this.dataSource.rows.latestValue

      let rowKey: TPrimaryKey | null = null
      let isCreatingNewRows = false
      const newRows: IGridRow[] = []
      const newCells: IGridCellCoordinates[] = [] 
      
      for (const row of finalValues) {
        if (!isCreatingNewRows) {
          if (!rowKey) rowKey = startCell.rowKey
          else {
            const gridRow = this.rowOperations.GetRow.run(rowKey)
            if (typeof gridRow === 'undefined') throw new Error(`Unable to get grid row with primary key of ${rowKey}`)
            const rowIndex = this.rowOperations.GetIndexOfRow.run(gridRow)
            const nextRow  = visibleRows[rowIndex + 1]
            if (typeof nextRow === 'undefined') isCreatingNewRows = true
            else rowKey = nextRow.rowKey
          }
        }
        rowKey = rowKey as TPrimaryKey
        let   startColumn = startCell.columnKey
        let   colIndex    = columns.findIndex(c => c.columnKey === startColumn)
        
        if (isCreatingNewRows) {
          const newRow        = this.rowOperations.GenerateNewRow.run()
          const newPrimaryKey = newRow.rowKey
          for (const cellValue of row) {
            const column = columns[colIndex]
            newRow.setValue(column.columnKey, cellValue)
            newCells.push(new GridCellCoordinates(newPrimaryKey, column.columnKey))
            colIndex++
          }
          newRows.push(newRow)
          endCell.rowKey    = newPrimaryKey
          endCell.columnKey = columns[colIndex].columnKey
        } else {
          for (const cellValue of row) {
            const column = columns[colIndex]
            const cellCoordinates = new GridCellCoordinates(rowKey, column.columnKey)
            const isEditable      = this.cellOperations.GetCellIsEditable.run(cellCoordinates)
            if (isEditable) {
              this.cellOperations.SetCellValue.run(cellCoordinates, cellValue)
              this.cellOperations.SetCellDraftValue.buffer(cellCoordinates)
              const cellComponent = this.cellOperations.CellComponents.findWithCoords(cellCoordinates)
              if (cellComponent) cellComponent.setValue(cellValue)
            }
            colIndex++
            endCell.rowKey    = rowKey
            endCell.columnKey = column.columnKey
          }
        }
      }

      // Insert new rows
      if (newRows.length) {

        let index = visibleRows.length
        for (const row of newRows) {
          const { rowKey } = row
          dataSource.insertNewRows(row)
          this.rowOperations.SetRowStatus.buffer(rowKey, ERowStatus.New)
          index++
        }
        
        for (const cell of newCells) {
          this.cellOperations.SetCellDraftValue.buffer(cell)
          this.cellOperations.SetCellMeta.run(cell, [{ key: EMetadataType.CanUpdate, value: true }])
        }

      } 

      this.selection.SelectRange.run(startCell, endCell)
      this.selection.EmitNextSelectionSlice.run()
      this.selection.ScrollIntoView.run()

    }

  }

  private _getStartCell() {
    return this.selection.latestSelection()?.getBounds().topLeft
  }

}

export interface IGridPasteText {
  plainText?: string
  html?: string
}

interface ICellData {
  plainText: string,
  html?: string
}

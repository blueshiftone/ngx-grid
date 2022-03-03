import { IGridCellValue, IGridSelectionSlice } from '../../../typings/interfaces'
import { GridCellCoordinates, GridCellValue } from '../../../typings/interfaces/implementations'
import { GridSelectionController } from '../grid-selection.controller'

export class GetSelectionSliceOperation {
  
  constructor(private readonly controller: GridSelectionController) {}

  public run(): IGridSelectionSlice | null {
    const selection = this.controller.latestSelection
    const columns   = this._getColumns()
    if (!selection || !columns || !columns.visibleColumns.length) return null
    const utils = selection.globalUtils
    const rows  = this.controller.rowOperations.GetAllRows.filteredRows()
    const output: IGridSelectionSlice = {
      selection     : selection,
      cells         : [],
      rows          : [],
      cellsFormatted: [],
      rowsFormatted : [],
      columnKeys    : [],
      rowKeys       : []
    }
    const rowIndexes = Array.from(selection.rowIndexes)
    const primaryKeys = selection.rowKeys
    const selectionRowsSorted = [...rowIndexes].sort((a, b) => a - b)
    const lastSlice = this._getLastSlice()
    for (const rowIndex of selectionRowsSorted) {
      const rowData = rows[rowIndex]

      const index = rowIndexes.indexOf(rowIndex)
      const rowKey = primaryKeys[index]

      // Extract information from the last slice if not contained in current selection
      if (typeof rowData === 'undefined') {

        const row = lastSlice?.rows.find(row => row[this._indexOfPrimaryKey] === rowKey)
        const rowFormatted = lastSlice?.rowsFormatted.find(row => row[this._indexOfPrimaryKey] === rowKey)
        const cells = row ? lastSlice?.cells[lastSlice.rows.indexOf(row)] : null
        const cellsFormatted = row ? lastSlice?.cellsFormatted[lastSlice.rows.indexOf(row)] : null

        if (typeof row !== 'undefined' && typeof rowFormatted !== 'undefined') {
          output.rowKeys.push(rowKey)
          output.rows.push(row)
          output.rowsFormatted.push(rowFormatted)
          output.cells.push(cells ?? [])
          output.cellsFormatted.push(cellsFormatted ?? [])
          const visibleColumns = this._getColumns()?.visibleColumns ?? []
          row.forEach((val, index) => {
            if (typeof val === 'undefined') return
            const colKey = visibleColumns[index]
            if (colKey && !output.columnKeys.includes(colKey)) output.columnKeys.push(colKey)
          })
        } else {
          console.warn(`Unable to extract selection slice for record with primaryKey '${rowKey}'`)
        }

        continue
      }
      const outputRowData: any[]           = []
      const outputRowDataFormatted: any[]  = []
      const outputCellData: any[]          = []
      const outputCellDataFormatted: any[] = []
      const selectedCols                   = selection.colsAt(utils.getRowKeyFromIndex(rowIndex) || '')
      const cellDataStartsAt               = Math.min(...selection.columnIndexes)
      const cellDataEndsAt                 = Math.max(...selection.columnIndexes)
      const visibleColumns                 = columns.visibleColumns
      visibleColumns.forEach((columnKey, index) => {
        let   val: IGridCellValue | undefined = rowData.getValue(columnKey) ?? new GridCellValue(new GridCellCoordinates(rowKey, columnKey), null)
        let   valFormatted = val?.value
        const cellMeta     = this.controller.gridController.cell.GetCellMeta.run(new GridCellCoordinates(rowKey, columnKey))
        const colMeta      = this.controller.gridController.column.GetColumnMeta.run(columnKey)
        const listGridID   = cellMeta?.type?.list?.relatedGridID ?? colMeta?.type?.list?.relatedGridID
        if (typeof listGridID !== 'undefined') {
          const valArray = Array.isArray(valFormatted) ? valFormatted : [valFormatted]
          let output: string[] = []
          for (const key of valArray) {
            output.push(this.controller.gridController.grid.GetRelatedDataPreviewString.run(listGridID, key) ?? '')
          }
          valFormatted = output.join(', ')
        }

        outputRowData.push(val.value)
        outputRowDataFormatted.push(valFormatted)
        if (!selectedCols.has(columnKey)) {
          val = undefined
          valFormatted = undefined
        }
        if (index >= cellDataStartsAt && index <= cellDataEndsAt) {
          outputCellData.push(val?.value)
          outputCellDataFormatted.push(valFormatted)
          if (!output.columnKeys.includes(columnKey)) output.columnKeys.push(columnKey)
        }
      })
      output.columnKeys.sort((a, b) => this._getVisibleIndexOf(a) - this._getVisibleIndexOf(b))
      output.rowKeys.push(rowKey)
      output.rows.push(outputRowData)
      output.rowsFormatted.push(outputRowDataFormatted)
      output.cells.push(outputCellData)
      output.cellsFormatted.push(outputCellDataFormatted)
    }
    
    this._gridEvents.GridSelectionSliceExtractedEvent.emit(output)

    return output
  }

  private _getColumns() {
    return this._gridEvents.ColumnsUpdatedEvent.state
  }

  private _getVisibleIndexOf(columnName: string) {
    return this._getColumns()?.visibleColumns.indexOf(columnName) ?? -1
  }

  private _getLastSlice() {
    return this._gridEvents.GridSelectionSliceExtractedEvent.state
  }

  private get _source() {
    return this._gridEvents.GridDataChangedEvent.state
  }

  private get _indexOfPrimaryKey(): number {
    const source = this._source
    if (!source) return -1
    return source.data.value.columns.indexOf(source.primaryColumnKey)
  }

  private get _gridEvents() {
    return this.controller.gridEvents
  }

}

import { GridControllerService } from '../../../../../controller/grid-controller.service'
import {
  IGridCellCoordinates,
  IGridCellMeta,
  IGridColumnMeta,
  IGridRow,
  IGridSelectListOption,
  IGridValueParsingResult,
} from '../../../../../typings/interfaces'
import { GridCellCoordinates } from '../../../../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../../../../typings/types'
import { TAtLeast } from '../../../../../typings/types/at-least.type'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class MultiSelectParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: TPrimaryKey[] | TPrimaryKey) { super() }

  public run(gridController: GridControllerService, cellCoords: TAtLeast<IGridCellCoordinates, 'columnKey'>): IGridValueParsingResult<TPrimaryKey[]> {
    
    const cellMeta = gridController.cell.GetCellMeta.run(new GridCellCoordinates(cellCoords.rowKey ?? '', cellCoords.columnKey,))
    const colMeta  = gridController.column.GetColumnMeta.run(cellCoords.columnKey)
    const gridID   = cellMeta?.type?.list?.relatedGridID ?? colMeta?.type?.list?.relatedGridID

    if (typeof gridID !== 'undefined') return this._foreignKeyParser(gridController, cellMeta, colMeta)
    else return this._staticKeyParser(cellMeta, colMeta)
    
  }

  private _staticKeyParser(
    cellMeta: IGridCellMeta | undefined,
    colMeta: IGridColumnMeta | undefined
  ): IGridValueParsingResult<string[]> {

    const options = cellMeta?.type?.list?.staticOptions ?? colMeta?.type?.list?.staticOptions ?? []

    const keys = (Array.isArray(this.initialValue) ? this.initialValue : [this.initialValue]).map(k => typeof k === 'string' ? k.trim() : k)

    const matchedOptions: IGridSelectListOption[] = []

    for (let key of keys) {
      key = key.toString().toLowerCase()
      const matchedIndex = options.map(op => {
        const output: IGridSelectListOption = {
          value: op.value?.toString().toLowerCase() ?? null,
          label: op.label?.toLowerCase()
        }
        return output
      }).findIndex(op => {
        return op.value == key || op.label === key
      })
      if (matchedIndex > -1) {
        const option = options[matchedIndex]
        matchedOptions.push(option)
      }
    }

    if (matchedOptions.length) {
      if (Array.isArray(this.initialValue)) {
        return this.passed(matchedOptions.map(op => op.value))
      } else {
        return this.passed(matchedOptions[0].value)
      }
    }

    return this.failed()
  }

  private _foreignKeyParser(
    gridController: GridControllerService,
    cellMeta: IGridCellMeta | undefined,
    colMeta: IGridColumnMeta | undefined
  ): IGridValueParsingResult<TPrimaryKey[]> {

    const gridID   = cellMeta?.type?.list?.relatedGridID ?? colMeta?.type?.list?.relatedGridID

    if (!gridID) return this.failed()
    
    const keys = (Array.isArray(this.initialValue) ? this.initialValue : [this.initialValue]).map(k => typeof k === 'string' ? k.trim() : k)
    const unmatchedKeys: TPrimaryKey[] = []

    const matchedRows: IGridRow[] = []

    for(let k of keys) {
      if (typeof k === 'string' && k.match(/^[0-9\.]+$/)) k = parseInt(k)
      const row = gridController.grid.GetRelatedGridRow.run(gridID, k) 
      if (typeof row !== 'undefined') {
        matchedRows.push(row)
      } else unmatchedKeys.push(k)
    }

    const grid = gridController.grid.GetRelatedData.run(gridID)

    if (unmatchedKeys.length && typeof grid !== 'undefined') {

      const previewStringMap = new Map<string, IGridRow>()
      const rows             = grid.rows
      const columns          = grid.columns

      for(const row of rows) {
        let outputString = grid.rowTemplateString
        for (const col of columns) {
          if (outputString.includes(col)) {
            const regex = new RegExp(`\\{\\{(?:\\s+)?${col}(?:\\s+)?\\}\\}`, 'g')
            outputString = outputString.replace(regex, row.getValue(col)?.value)
          }
        }
        previewStringMap.set(outputString, row)
      }

      for (const k of unmatchedKeys) {
        const row = previewStringMap.get(k.toString())
        if (typeof row !== 'undefined') {
          matchedRows.push(row)
        }
      }

    }

    if (matchedRows.length) {
      const output = matchedRows.map(row => row.rowKey).filter(row => typeof row !== 'undefined')
      if (Array.isArray(this.initialValue)) return this.passed(output)
      else return this.passed(output[0])
    }

    return this.failed()  
  }
}

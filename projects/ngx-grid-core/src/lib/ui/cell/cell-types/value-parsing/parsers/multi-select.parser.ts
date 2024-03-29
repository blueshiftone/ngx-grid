import { GridControllerService } from '../../../../../controller/grid-controller.service'
import {
  IGridCellCoordinates,
  IGridCellMeta,
  IGridColumn,
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
  constructor (public readonly initialValue: (TPrimaryKey | null)[] | (TPrimaryKey | null)) { super() }

  public run(gridController: GridControllerService, cellCoords: TAtLeast<IGridCellCoordinates, 'columnKey'>): IGridValueParsingResult<TPrimaryKey[]> {
    
    const cellMeta = gridController.cell.GetCellMeta.run(new GridCellCoordinates(cellCoords.rowKey ?? '', cellCoords.columnKey,))
    const colMeta  = gridController.dataSource.getColumn(cellCoords.columnKey)
    const gridID   = cellMeta?.type?.list?.relatedGridID ?? colMeta?.type?.list?.relatedGridID

    if (typeof gridID !== 'undefined') return this._foreignKeyParser(gridController, cellMeta, colMeta)
    else return this._staticKeyParser(cellMeta, colMeta)
    
  }

  private _staticKeyParser(
    cellMeta: IGridCellMeta | undefined,
    col: IGridColumn | undefined
  ): IGridValueParsingResult<string[]> {

    const options = cellMeta?.type?.list?.staticOptions ?? col?.type?.list?.staticOptions ?? []

    const keys = (Array.isArray(this.initialValue) ? this.initialValue : [this.initialValue]).map(k => typeof k === 'string' ? k.trim() : k).filter(k => k !== null) as string[]

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
    col: IGridColumn | undefined
  ): IGridValueParsingResult<TPrimaryKey[]> {

    const gridID   = cellMeta?.type?.list?.relatedGridID ?? col?.type?.list?.relatedGridID

    if (!gridID) return this.failed()
    
    const keys = (Array.isArray(this.initialValue) ? this.initialValue : [this.initialValue]).map(k => typeof k === 'string' ? k.trim() : k).filter(k => k !== null) as TPrimaryKey[]
    const unmatchedKeys: TPrimaryKey[] = []

    if (!keys.length) {
      return this.passed(Array.isArray(this.initialValue) ? [] : null)
    }

    const matchedRows: IGridRow[] = []

    // parse an array of primaryKey values like [1, 2, 3]
    for(let k of keys) {
      if (typeof k === 'string' && k.match(/^[0-9\.]+$/)) k = parseInt(k)
      const row = gridController.grid.GetRelatedGridRow.run(gridID, k)
      if (typeof row !== 'undefined') {
        matchedRows.push(row)
      } else unmatchedKeys.push(k)
    }

    const relatedGridDataSource = gridController.grid.GetRelatedData.run(gridID)

    // parse an array of row preview template strings values like ['Customer 1', 'Customer 2', 'Customer 3']
    if (unmatchedKeys.length && typeof relatedGridDataSource !== 'undefined') {

      const previewStringMap = new Map<string, IGridRow>()
      const rows = relatedGridDataSource.rows

      for(const row of rows.latestValue) {
        const previewString = gridController.row.GetRowPreviewString.run(row.rowKey, relatedGridDataSource)
        previewStringMap.set(previewString, row)
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

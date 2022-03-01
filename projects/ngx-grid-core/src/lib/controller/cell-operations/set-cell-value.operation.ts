import { IGridCellCoordinates, IGridCellValue, IGridValueParsingResult } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates, GridCellValue } from '../../typings/interfaces/implementations'
import { CELL_VALUE_PARSERS } from '../../ui/cell/cell-types/value-parsing'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { BufferOperation } from '../buffer-operation'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class SetCellValue extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(
    coordinates: IGridCellCoordinates,
    value: any,
    options?: Partial<ISetCellValueOptions>
  ): IGridValueParsingResult {

    const { rowKey, columnKey } = coordinates
    const source = this.gridOperations.source()
    const row    = this.rowOperations.GetRow.run(rowKey)
    const type   = this.cellOperations.GetCellType.run(coordinates).name

    const { primaryColumnKey, maskNewIds } = source

    const parseResults = CELL_VALUE_PARSERS[type].validate(value, this.cellOperations.gridController, coordinates)

    if (maskNewIds) {
      const rowMeta = this.rowOperations.GetRowMeta.run(rowKey)
      if (primaryColumnKey === columnKey && rowMeta?.isNew) {
        parseResults.isValid = true
        parseResults.isInvalid = false
        parseResults.transformedValue = value
      }
    }

    if (!type || parseResults.isInvalid) return parseResults

    row?.setValue(columnKey, parseResults.transformedValue)

    this.cellOperations.ValidateCell.run(coordinates)

    this._bufferOperation.next([coordinates, parseResults, options])

    return parseResults
  }

  private _bufferOperation = new BufferOperation((args: any) => this._emitChangedCells(args))

  private async _emitChangedCells(args: [IGridCellCoordinates, IGridValueParsingResult, Partial<ISetCellValueOptions> | undefined][]) {

    const changed: IGridCellValue[] = []
    
    for (const arg of args) {
      const [coordinates, validation, options] = arg
      const { rowKey, columnKey } = coordinates
      if (validation.isValid && WithDefaultTrue(options?.emitEvent)) {
        changed.push(new GridCellValue(new GridCellCoordinates(rowKey, columnKey), validation.transformedValue))
      }
    }

    this.gridEvents.CellValueChangedEvent.emit(changed)

  }

}

export interface ISetCellValueOptions {
  emitEvent: boolean
}

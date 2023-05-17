import { IGridCellCoordinates, IGridCellValue, IGridValueParsingResult } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates, GridCellValue } from '../../typings/interfaces/implementations'
import { CELL_VALUE_PARSERS } from '../../ui/cell/cell-types/value-parsing'
import { WithDefaultTrue } from '../../utils/with-default'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class SetCellValue extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(
    coordinates: IGridCellCoordinates,
    value: any,
    options?: Partial<ISetCellValueOptions>
  ): IGridValueParsingResult {

    const { rowKey, columnKey } = coordinates
    const row  = this.dataSource.getRow(rowKey)
    const type = this.cellOperations.GetCellType.run(coordinates).name

    const { primaryColumnKey, maskNewIds } = this.dataSource

    const parseResults = CELL_VALUE_PARSERS[type].validate(value, this.controller, coordinates)

    if (maskNewIds) {
      const row = this.dataSource.getRow(rowKey)
      if (primaryColumnKey === columnKey && row?.isNew) {
        parseResults.isValid = true
        parseResults.isInvalid = false
        parseResults.transformedValue = value
      }
    }

    if (!type || parseResults.isInvalid) return parseResults

    row?.setValue(columnKey, parseResults.transformedValue)

    this.cellOperations.ValidateCell.run(coordinates)

    if (WithDefaultTrue(options?.emitEvent)) {
      this._bufferEmitChangedCells.next([coordinates, parseResults])
    }

    return parseResults
  }

  private _bufferEmitChangedCells = new BufferOperation((args: any) => this._emitChangedCells(args))

  private async _emitChangedCells(args: [IGridCellCoordinates, IGridValueParsingResult][]) {

    const changed: IGridCellValue[] = []
    
    for (const arg of args) {
      const [coordinates, validation] = arg
      const { rowKey, columnKey } = coordinates
      changed.push(new GridCellValue(new GridCellCoordinates(rowKey, columnKey), validation.transformedValue))
    }

    this.gridEvents.CellValueChangedEvent.emit(changed)

  }

}

export interface ISetCellValueOptions {
  emitEvent: boolean
}

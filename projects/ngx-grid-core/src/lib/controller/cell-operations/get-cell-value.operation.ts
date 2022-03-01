import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellValue extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates) {
    return this.rowOperations.rowKeyMap.get(coordinates.rowKey)?.getValue(coordinates.columnKey) ?? null
  }

}

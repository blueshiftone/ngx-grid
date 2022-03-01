import { IGridCellCoordinates, IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellMeta extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): IGridCellMeta | undefined {
    return this.gridOperations.source()?.cellMeta.get(coordinates.compositeKey)
  }

}

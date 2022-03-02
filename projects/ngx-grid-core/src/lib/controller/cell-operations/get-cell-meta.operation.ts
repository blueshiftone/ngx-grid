import { IGridCellCoordinates, IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellMeta extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): IGridCellMeta {
    return this.gridOperations.source()?.cellMeta.get(coordinates.compositeKey) ?? { coords: coordinates, metadata: GridImplementationFactory.gridMetadataCollection() }
  }

}

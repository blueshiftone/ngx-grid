import { IGridCellCoordinates, IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { Operation } from '../operation.abstract'

export class GetCellMeta extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates): IGridCellMeta {
    return this.dataSource.cellMeta.get(coordinates.compositeKey) ?? { coords: coordinates, metadata: GridImplementationFactory.gridMetadataCollection() }
  }

}

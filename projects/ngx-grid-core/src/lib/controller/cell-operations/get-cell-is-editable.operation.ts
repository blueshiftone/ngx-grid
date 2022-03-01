import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellIsEditable extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): boolean {
    return this.cellOperations.GetCellMetaValue.run<boolean>(coordinates, EMetadataType.CanUpdate)
      ?? true
  }

}

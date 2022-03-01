import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class HasDraftValue extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): boolean {
    return this.cellOperations.GetCellValue.run(coordinates)?.isDraft === true
  }

}

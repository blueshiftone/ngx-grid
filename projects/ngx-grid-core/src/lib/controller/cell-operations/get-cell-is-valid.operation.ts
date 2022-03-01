import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellIsValid extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): boolean {
    return WithDefaultTrue(this.cellOperations.GetCellValue.run(coordinates)?.validationState?.nextIsValid)
  }

}

import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { Operation } from '../operation.abstract'

export class GetCellIsValid extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates): boolean {
    return WithDefaultTrue(this.cellOperations.GetCellValue.run(coordinates)?.validationState?.nextIsValid)
  }

}

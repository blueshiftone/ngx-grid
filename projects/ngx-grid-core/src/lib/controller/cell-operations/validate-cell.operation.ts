import { IGridCellCoordinates, IGridValueValidationResult } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { ValueValidator } from '../../ui/cell/cell-types/value-validation/value-validator'
import { Operation } from '../operation.abstract'

export class ValidateCell extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(cellCoordinates: IGridCellCoordinates): IGridValueValidationResult[] {

    const cellValue         = this.cellOperations.GetCellValue.run(cellCoordinates)
    const validationResults = ValueValidator.validate(cellValue?.value, this.cellOperations.gridController, cellCoordinates)
    const previousIsValid   = this.cellOperations.GetCellIsValid.run(cellCoordinates)
    const nextIsValid       = validationResults.length === 0
    const nextState         = { cellCoordinates, validationResults, previousIsValid, nextIsValid }
    
    if (cellValue) cellValue.validationState = nextState
    if (!nextIsValid || nextIsValid != previousIsValid) this.gridEvents.CellValidationStateChangedEvent.emit(nextState)
    return validationResults
  }

}

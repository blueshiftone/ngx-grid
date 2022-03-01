import { IGridCellCoordinates, IGridValueValidationResult } from '.'

export interface IGridCellValidationState {
  cellCoordinates  : IGridCellCoordinates,
  validationResults: IGridValueValidationResult[]
  previousIsValid  : boolean
  nextIsValid      : boolean
}

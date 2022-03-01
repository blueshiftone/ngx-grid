import { IGridCellCoordinates, IGridCellValidationState } from '.'

export interface IGridCellValue extends IGridCellCoordinates {
  value           : any
  isDraft         : boolean
  validationState?: IGridCellValidationState
  clone(): IGridCellValue
}

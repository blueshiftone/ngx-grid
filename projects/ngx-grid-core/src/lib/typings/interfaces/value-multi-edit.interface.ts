import { IGridCellCoordinates } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'

export interface IValueMultiEdit {
  label        : string
  longLabel?   : string
  requiresInput: boolean
  inputType?   : 'number' | 'text'
  initialize(gridController: GridControllerService, cell: IGridCellCoordinates): void
  run<T      = any>(input: T)                                                  : void
}

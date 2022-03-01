import { IGridCellCoordinates, IGridValueParsingResult } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { TAtLeast } from '../types/at-least.type'

export interface ICellValueParser {
  validate (
    value: any,
    gridController: GridControllerService,
    cellCoords: TAtLeast<IGridCellCoordinates, 'columnKey'>
  ): IGridValueParsingResult
}

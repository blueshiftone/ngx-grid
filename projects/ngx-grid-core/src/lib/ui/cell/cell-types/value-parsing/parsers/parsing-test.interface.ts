import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { IGridCellCoordinates, IGridValueParsingResult } from '../../../../../typings/interfaces'
import { TAtLeast } from '../../../../../typings/types/at-least.type'

export interface IParsingTest {
  run(
    gridController: GridControllerService,
    cellCoords: TAtLeast<IGridCellCoordinates, 'columnKey'>
  ): IGridValueParsingResult
}

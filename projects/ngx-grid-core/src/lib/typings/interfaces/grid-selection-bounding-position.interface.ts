import { IGridCellCoordinates } from './grid-cell-coordinates.interface'



export interface IGridSelectionBoundingPosition extends IGridCellCoordinates {
  opposite: IGridSelectionBoundingPosition
}

import { TColumnKey } from '../types/column-key.type'
import { TPrimaryKey } from '../types/primary-key.type'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'


export interface IGridCellFocused extends IGridCellCoordinates {
  isCol (columnKey: TColumnKey)            : boolean
  isRow (rowKey: TPrimaryKey)              : boolean
  isCell(coordinates: IGridCellCoordinates): boolean
  timeFocused: number
}

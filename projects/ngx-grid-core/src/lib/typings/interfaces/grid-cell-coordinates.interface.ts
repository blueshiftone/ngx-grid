import { TColumnKey } from '../types/column-key.type'
import { TPrimaryKey } from '../types/primary-key.type'

export interface IGridCellCoordinates {
  rowKey      : TPrimaryKey
  columnKey   : TColumnKey
  compositeKey: string
  equals(other: IGridCellCoordinates): boolean
}

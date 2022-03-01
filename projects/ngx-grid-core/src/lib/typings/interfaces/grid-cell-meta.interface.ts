import { IGridCellCoordinates, IGridMetadataCollection } from '.'
import { IGridDataType } from './grid-data-type.interface'

export interface IGridCellMeta {
  coords: IGridCellCoordinates
  type?     : IGridDataType
  metadata  : IGridMetadataCollection
}

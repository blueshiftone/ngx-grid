import { IGridCellCoordinates, IGridMetadataCollection } from '.'
import { ECellActivityState } from '../enums'
import { IGridDataType } from './grid-data-type.interface'

export interface IGridCellMeta {
  coords        : IGridCellCoordinates
  type?         : IGridDataType
  metadata      : IGridMetadataCollection
  activityState?: ECellActivityState
}

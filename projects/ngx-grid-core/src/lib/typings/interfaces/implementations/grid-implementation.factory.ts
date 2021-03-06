import { GridColumnWidths, GridFocusedCell, GridRow, GridRowMeta, GridSelectionRange } from '.'
import {
  IGridCellCoordinates,
  IGridCellFocused,
  IGridColumnWidth,
  IGridColumnWidths,
  IGridMetadataCollection,
  IGridMetadataInfo,
  IGridRow,
  IGridRowMeta,
  IGridSelectionRange,
} from '..'
import { IGridEventsFactory } from '../../../events/grid-events.service'
import { EGridStyle } from '../../../styles/grid-style.enum'
import { GridStyle } from '../../../styles/grid-style.implementation'
import { TColumnKey, TPrimaryKey, TRowValues } from '../../types'
import { IGridStyle } from '../grid-style.interface'
import { GridMetadataCollection } from './grid-metadata-collection.implementation'

export class GridImplementationFactory {
  public static gridMetadataCollection = (metadata: IGridMetadataInfo[] = [])                : IGridMetadataCollection => new GridMetadataCollection(metadata)
  public static gridColumnWidths       = (column: IGridColumnWidth[], changed: string | null): IGridColumnWidths       => new GridColumnWidths(column, changed)
  public static gridFocusedCell        = (pos: IGridCellCoordinates)                         : IGridCellFocused        => new GridFocusedCell(pos)
  public static gridRowMeta            = (meta: Partial<IGridRowMeta>)                       : IGridRowMeta            => new GridRowMeta(meta)
  public static gridRow                = (primaryKeyColumn: TColumnKey, values: TRowValues)  : IGridRow                => new GridRow(primaryKeyColumn, values)
  public static gridStyle              = (style: EGridStyle)                                 : IGridStyle              => new GridStyle(style)

  public static gridSelectionRange = (gridEvents: IGridEventsFactory,
    input?: Partial<IGridSelectionRange>,
    rowMap?: Map<TPrimaryKey, Set<TColumnKey>>,
    colMap?: Map<TColumnKey, Set<TPrimaryKey>>
  ): IGridSelectionRange => new GridSelectionRange(gridEvents, input, rowMap, colMap)

}

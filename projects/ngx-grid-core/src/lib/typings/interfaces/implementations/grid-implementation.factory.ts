import { GridColumn, GridColumnWidths, GridFocusedCell, GridRow, GridSelectionRange } from '.'
import {
  IGridCellCoordinates,
  IGridCellFocused,
  IGridColumn,
  IGridColumnWidths,
  IGridMetadataCollection,
  IGridMetadataInfo,
  IGridRow,
  IGridSelectionRange,
} from '..'
import { GridControllerService } from '../../../controller/grid-controller.service'
import { EGridStyle } from '../../../styles/grid-style.enum'
import { GridStyle } from '../../../styles/grid-style.implementation'
import { TColumnKey, TPrimaryKey, TRowValues } from '../../types'
import { IGridStyle } from '../grid-style.interface'
import { GridMetadataCollection } from './grid-metadata-collection.implementation'

export class GridImplementationFactory {
  public static gridMetadataCollection = (metadata: IGridMetadataInfo[] = [])                    : IGridMetadataCollection => new GridMetadataCollection(metadata)
  public static gridColumnWidths       = (column: Map<string, number>, changedOne: string | null): IGridColumnWidths       => new GridColumnWidths(column, changedOne)
  public static gridFocusedCell        = (pos: IGridCellCoordinates)                             : IGridCellFocused        => new GridFocusedCell(pos)
  public static gridRow                = (primaryKeyColumn: TColumnKey, values: TRowValues)      : IGridRow                => new GridRow(primaryKeyColumn, values)
  public static gridColumn             = (columnKey: TColumnKey)                                 : IGridColumn             => new GridColumn(columnKey)
  public static gridStyle              = (style: EGridStyle)                                     : IGridStyle              => new GridStyle(style)

  public static gridSelectionRange = (controller: GridControllerService,
    input?: Partial<IGridSelectionRange>,
    rowMap?: Map<TPrimaryKey, Set<TColumnKey>>,
    colMap?: Map<TColumnKey, Set<TPrimaryKey>>
  ): IGridSelectionRange => new GridSelectionRange(controller, input, rowMap, colMap)

}

import { BehaviorSubject } from 'rxjs'

import { IGridCellMeta, IGridColumnMeta, IGridMetadataCollection, IGridRawData, IGridRowMeta, IGridSeperator } from '.'
import { TPrimaryKey } from '../types'

export interface IGridDataSource {
  dataSetName             : string
  dataGridID              : string
  data                    : BehaviorSubject<IGridRawData>,
  primaryColumnKey        : string
  visibleColumns          : string[]
  hiddenColumns           : string[]
  columnMeta              : IGridColumnMeta[]
  rowMeta                 : Map<TPrimaryKey, IGridRowMeta>
  cellMeta                : Map<string, IGridCellMeta>
  disabled                : boolean
  canUpdate               : boolean
  canDelete               : boolean
  canInsert               : boolean
  allColumnKeys           : string[]
  relatedData             : Map<string, IGridDataSource>
  rowPreviewTemplateString: string
  seperators              : IGridSeperator[] 
  maskNewIds              : boolean
  metadata                : IGridMetadataCollection
}

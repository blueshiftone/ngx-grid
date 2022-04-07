import { Subject } from 'rxjs'

import { IGridCellMeta, IGridColumnMeta, IGridMetadataCollection, IGridRowMeta } from '.'
import { TColumnKey, TPrimaryKey } from '../types'
import { IDestroyable } from './destroyable.interface'
import { IGridRow } from './grid-row.interface'

export interface IGridDataSource extends IDestroyable {
  onChanges        : Subject<IGridDataSource>
  dataSetName      : string
  dataGridID       : string
  readonly columns : string[]
  readonly rows    : IGridRow[]
  primaryColumnKey : string
  visibleColumns   : string[]
  hiddenColumns    : string[]
  columnMeta       : IGridColumnMeta[]
  rowMeta          : Map<TPrimaryKey, IGridRowMeta>
  cellMeta         : Map<string, IGridCellMeta>
  disabled         : boolean
  canUpdate        : boolean
  canDelete        : boolean
  canInsert        : boolean
  relatedData      : Map<string, IGridDataSource>
  rowTemplateString: string
  maskNewIds       : boolean
  metadata         : IGridMetadataCollection

  getRow              (key: TPrimaryKey)                        : IGridRow | undefined
  upsertRows          (...rows: IGridRow[])                     : IGridRow[]
  upsertRows          (index: number, ...rows: IGridRow[])      : IGridRow[]
  removeRows          (...rows: (TPrimaryKey | IGridRow)[])     : void
  upsertColumns       (...columnKey: string[])                  : void
  createRowFromObject (rowObj: {[key: TColumnKey]: any})        : IGridRow
  clearData           ()                                        : void
  changeRowPrimaryKey (oldKey: TPrimaryKey, newKey: TPrimaryKey): void
}

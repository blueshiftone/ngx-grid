import { Subject } from 'rxjs'

import { IGridCellMeta, IGridColumn, IGridMetadataCollection } from '.'
import { TColumnKey, TPrimaryKey } from '../types'
import { IDestroyable } from './destroyable.interface'
import { IGridRow } from './grid-row.interface'

export interface IGridDataSource extends IDestroyable {
  onChanges        : Subject<IGridDataSource>
  dataSetName      : string
  dataGridID       : string
  columns          : IGridColumn[]
  rows             : IGridRow[]
  primaryColumnKey : string
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
  getColumn           (key: TColumnKey)                         : IGridColumn | undefined
  upsertRows          (rows: IGridRow[])                        : IGridRow[]
  upsertRows          (...rows: IGridRow[])                     : IGridRow[]
  upsertRows          (index: number, ...rows: IGridRow[])      : IGridRow[]
  removeRows          (...rows: (TPrimaryKey | IGridRow)[])     : void
  setColumns          (columns: IGridColumn[])                  : void
  createRowFromObject (rowObj: {[key: TColumnKey]: any})        : IGridRow
  clearData           ()                                        : void
  changeRowPrimaryKey (oldKey: TPrimaryKey, newKey: TPrimaryKey): void
}

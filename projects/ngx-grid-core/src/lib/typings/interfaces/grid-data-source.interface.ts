import { Observable } from 'rxjs'

import { IGridCellMeta, IGridColumn, IGridMetadataCollection } from '.'
import { TColumnKey, TPrimaryKey } from '../types'
import { IDestroyable } from './destroyable.interface'
import { IGridRow } from './grid-row.interface'

export interface IGridDataSource extends IDestroyable {
  onChanges        : Observable<void>
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
  leafLevel        : number

  getRow              (key: TPrimaryKey)                        : IGridRow | undefined
  getUnderlyingRows   ()                                        : IGridRow[]
  setRows             (rows: IGridRow[], subset?: boolean)      : void
  clearRowSubset      ()                                        : void
  getColumn           (key: TColumnKey)                         : IGridColumn | undefined
  getUnderlyingColumns()                                        : IGridColumn[]
  setColumns          (columns: IGridColumn[], subset?: boolean): void
  clearColumnSubset   ()                                        : void
  upsertRows          (rows: IGridRow[])                        : IGridRow[]
  upsertRows          (...rows: IGridRow[])                     : IGridRow[]
  upsertRows          (index: number, ...rows: IGridRow[])      : IGridRow[]
  removeRows          (...rows: (TPrimaryKey | IGridRow)[])     : void
  createRowFromObject (rowObj: {[key: TColumnKey]: any})        : IGridRow
  clearData           ()                                        : void
  changeRowPrimaryKey (oldKey: TPrimaryKey, newKey: TPrimaryKey): void
}

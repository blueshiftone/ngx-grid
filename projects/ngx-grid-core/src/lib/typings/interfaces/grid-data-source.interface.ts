import { Observable } from 'rxjs'

import { IGridCellMeta, IGridColumn, IGridMetadataCollection } from '.'
import { RowPipeline } from '../../controller/transform-pipeline/row-pipeline'
import { TColumnKey, TPrimaryKey } from '../types'
import { IDestroyable } from './destroyable.interface'
import { IGridRow } from './grid-row.interface'

export interface IGridDataSource extends IDestroyable {
  onChanges        : Observable<void>
  dataSetName      : string
  dataGridID       : string
  columns          : IGridColumn[]
  rows             : RowPipeline
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

  getRow               (key: TPrimaryKey)                        : IGridRow | undefined
  setRows              (rows: IGridRow[], subset?: boolean)      : void
  addRow               (row: IGridRow)                           : void
  getColumn            (key: TColumnKey)                         : IGridColumn | undefined
  hasColumnSubset      ()                                        : boolean
  getUnderlyingColumns ()                                         : IGridColumn[]
  setColumns           (columns: IGridColumn[], subset?: boolean): void
  clearColumnSubset    ()                                        : void
  insertNewRows        (rows: IGridRow[])                        : void
  insertNewRows        (...rows: IGridRow[])                     : void
  insertNewRows        (index: number, ...rows: IGridRow[])      : void
  removeRows           (...rows: (TPrimaryKey | IGridRow)[])     : void
  createRowFromObject  (rowObj: {[key: TColumnKey]: any})        : IGridRow
  clearData            ()                                        : void
  changeRowPrimaryKey  (oldKey: TPrimaryKey, newKey: TPrimaryKey): void
}

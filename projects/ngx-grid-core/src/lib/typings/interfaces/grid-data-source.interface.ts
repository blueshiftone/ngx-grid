import { Observable } from 'rxjs'

import { IGridCellMeta, IGridColumn, IGridMetadataCollection } from '.'
import { RowPipeline } from '../../controller/transform-pipeline/row-pipeline'
import { ILocalization } from '../../services/localization.service'
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
  localizations?   : ILocalization[]

  rowExists            (key: TPrimaryKey): boolean
  getRow               (key: TPrimaryKey): IGridRow | undefined
  setRows              (rows: IGridRow[]): void
  addRow               (row: IGridRow)   : void
  getColumn            (key: TColumnKey) : IGridColumn | undefined
  hasColumnSubset      ()                : boolean
  getUnderlyingColumns ()                : IGridColumn[]
  
  /**
   * Sets the columns in the grid from columnKeys
   *
   * @remarks
   * Re-uses existing column objects if they exist, otherwise creates new column objects
   * 
   * @param columnKeys - The columns to replace the existing columns with
   *
   */
  setColumns(columnKeys: string[], subset?: boolean) : void

  /**
   * Sets the columns in the grid using provided columns
   *
   * @param columns - The columns to replace the existing columns with
   *
   */
  setColumns (columns: IGridColumn[], subset?: boolean): void

  clearColumnSubset    ()                                        : void
  upsertRows           (rows: IGridRow[])                        : void
  insertNewRows        (rows: IGridRow[])                        : void
  insertNewRows        (...rows: IGridRow[])                     : void
  insertNewRows        (index: number, ...rows: IGridRow[])      : void
  removeRows           (...rows: (TPrimaryKey | IGridRow)[])     : void
  createRowFromObject  (rowObj: {[key: TColumnKey]: any})        : IGridRow
  clearRows            ()                                        : void
  changeRowPrimaryKey  (oldKey: TPrimaryKey, newKey: TPrimaryKey): void
}

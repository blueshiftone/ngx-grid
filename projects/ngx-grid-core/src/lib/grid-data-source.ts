import { Subject, SubscriptionLike } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { EMetadataType } from './typings/enums'
import { IGridCellMeta, IGridCellValue, IGridColumn, IGridDataSource, IGridMetadataCollection, IGridRow, IGridRowMeta } from './typings/interfaces'
import { GridCellCoordinates, GridCellValue, GridMetadataCollection } from './typings/interfaces/implementations'
import { GridImplementationFactory } from './typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from './typings/types/column-key.type'
import { TPrimaryKey } from './typings/types/primary-key.type'
import { Randomish } from './utils/randomish'

export class GridDataSource implements IGridDataSource {

  public columns: IGridColumn[] = []
  public rows   : IGridRow[]    = []
  public dataSetName            = ''
  public dataGridID             = ''
  public primaryColumnKey       = 'ID'
  public disabled               = false
  public maskNewIds: boolean    = false
  
  public onChanges = new Subject<IGridDataSource>()
  
  public relatedData: Map<string,      IGridDataSource> = new Map()
  public cellMeta   : Map<string,      IGridCellMeta>   = new Map()
  public rowMeta    : Map<TPrimaryKey, IGridRowMeta>    = new Map()
  public columnMeta : Map<TColumnKey,  IGridColumn> = new Map()

  public metadata: IGridMetadataCollection = new GridMetadataCollection()

  private _subs = new Set<SubscriptionLike>()

  private _rowMap        = new Map<TPrimaryKey, IGridRow>()
  private _colMap        = new Map<TColumnKey, IGridColumn>()
  private _changesStream = new Subject<void>()

  constructor(input?: Partial<IGridDataSource>) {
    if (input) Object.assign(this, input)
    
    for (const row of this.rows) this._rowMap.set(row.rowKey, row)
    for (const col of this.columns) this._colMap.set(col.columnKey, col)

    this._subs.add(this._changesStream.pipe(debounceTime(1)).subscribe(_ => {
      this.onChanges.next(this)
    }))

  }

  public get rowTemplateString(): string {
    return this.metadata.get<string>(EMetadataType.RecordPreviewTemplateString) ?? ""
  }
  
  public get canUpdate(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanUpdate) ?? true
  }

  public get canDelete(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanDelete) ?? true
  }

  public get canInsert(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanInsert) ?? true
  }

  public static cloneMeta(g: IGridDataSource, input?: Partial<IGridDataSource>) {
    const props: Partial<IGridDataSource> = {
      dataGridID      : g.dataGridID,
      dataSetName     : g.dataSetName,
      primaryColumnKey: g.primaryColumnKey,
      columns         : g.columns,
      disabled        : g.disabled,
      metadata        : g.metadata,
      cellMeta        : g.cellMeta,
      rowMeta         : g.rowMeta,
    }
    if (typeof input?.dataGridID === 'undefined'){
      props.dataGridID = `${g.dataGridID}-clone-${Randomish()}`
    }
    return new GridDataSource(Object.assign(props, input))
  }

  public static cloneSource(g: IGridDataSource, input?: Partial<IGridDataSource>) {
    const source = GridDataSource.cloneMeta(g, input)
    source.upsertRows(...g.rows.map(row => row.clone()))
    source.setColumns(g.columns)
    return source
  }

  public getRow(key: TPrimaryKey): IGridRow | undefined {
    return this._rowMap.get(key)
  }

  public getColumn(key: TColumnKey): IGridColumn | undefined {
    return this._colMap.get(key)
  }

  public createRowFromObject(rowObj: {[key: TColumnKey]: any}): IGridRow {
    return GridImplementationFactory.gridRow(this.primaryColumnKey, new Map<TColumnKey, IGridCellValue>(
      Object.keys(rowObj).map(key => ([key, new GridCellValue(new GridCellCoordinates(rowObj[this.primaryColumnKey], key), rowObj[key])]))
    ))
  }

  upsertRows(rows: IGridRow[]): IGridRow[]
  upsertRows(...rows: IGridRow[]): IGridRow[]
  upsertRows(index: number, ...rows: IGridRow[]): IGridRow[]
  upsertRows(indexRowOrRows: number | IGridRow | IGridRow[], ...rows: IGridRow[]): IGridRow[] {
    if (Array.isArray(indexRowOrRows)) rows = indexRowOrRows
    else if (typeof indexRowOrRows === 'object') rows.unshift(indexRowOrRows)
    const index = Number.isInteger(indexRowOrRows) ? (indexRowOrRows as number) : -1
    const output: IGridRow[] = []
    for (const row of rows) {
      const existingRow = this.getRow(row.rowKey)
      if (existingRow) {
        for (const value of row.values.values()) {
          existingRow.setValue(value.columnKey, value.value)
        }
        output.push(existingRow)
      } else {
        if (index > -1) this.rows.splice(index, 0, row)
        else this.rows.push(row)
        this._rowMap.set(row.rowKey, row)
        output.push(row)
      }
    }
    this._changesStream.next()
    return output
  }

  public removeRows(...rows: (TPrimaryKey | IGridRow)[]): void {
    for (let row of rows) {
      if (typeof row !== 'object') {
        const existingRow = this.getRow(row)
        if (!existingRow) return
        row = existingRow
      }
      const index = this.rows.indexOf(row)
      if (index > -1) {
        this.rows.splice(index, 1)
      }
      this._rowMap.delete(row.rowKey)
    }
    this._changesStream.next()
  }

  public setColumns(columns: IGridColumn[]): void {
    this.columns = columns
    this._colMap.clear()
    for (const col of columns) this._colMap.set(col.columnKey, col)
    this._changesStream.next()
  }

  public clearData(): void {
    this._rowMap.clear()
    this._colMap.clear()
    this.rows.length = 0
    this.columns.length = 0
    this._changesStream.next()
  }

  public onDestroy(): void {
    this._subs.forEach(s => s.unsubscribe())
  }

  public changeRowPrimaryKey(oldKey: TPrimaryKey, newKey: TPrimaryKey): void {
    const row = this.getRow(oldKey)
    if (!row) throw Error("Unable to find row matching the old key")
    this._rowMap.delete(oldKey)
    this._rowMap.set(newKey, row)
    row.setValue(this.primaryColumnKey, newKey)
    row.values.forEach(v => v.rowKey = newKey)
  }

}

import { Subject, SubscriptionLike } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { EMetadataType } from './typings/enums'
import { IGridCellMeta, IGridCellValue, IGridColumn, IGridDataSource, IGridMetadataCollection, IGridRow } from './typings/interfaces'
import { GridCellCoordinates, GridCellValue, GridMetadataCollection } from './typings/interfaces/implementations'
import { GridImplementationFactory } from './typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from './typings/types/column-key.type'
import { TPrimaryKey } from './typings/types/primary-key.type'
import { Randomish } from './utils/randomish'

export class GridDataSource implements IGridDataSource {

  private _columns: IGridColumn[] = []
  private _rows   : IGridRow[]    = []

  public get columns(): IGridColumn[] {
    return this._columnsSubset ?? this._columns
  }

  public get rows(): IGridRow[] {
    return this._rowsSubset ?? this._rows
  }

  private _columnsSubset?: IGridColumn[]
  private _rowsSubset   ?: IGridRow[] // a subset is used when applying specific operations like grouping, filtering, etc

  public dataSetName      = ''
  public dataGridID       = ''
  public primaryColumnKey = 'ID'
  public disabled         = false
  public maskNewIds       = false
  public leafLevel        = 0
  
  public relatedData: Map<string, IGridDataSource> = new Map()
  public cellMeta   : Map<string, IGridCellMeta>   = new Map()

  public metadata: IGridMetadataCollection = new GridMetadataCollection()

  private _subs = new Set<SubscriptionLike>()
  private _rowMap = new Map<TPrimaryKey, IGridRow>()
  private _colMap = new Map<TColumnKey, IGridColumn>()
  private _changesStream = new Subject<void>()
  
  public onChanges = this._changesStream.pipe(debounceTime(1))

  constructor(input?: Partial<IGridDataSource>) {
    // We can't use Object.assign for rows and columns because these properties are getters
    if (input?.rows) {
      this.setRows(input.rows)
      delete input.rows
    }
    if (input?.columns) {
      this.setColumns(input.columns)
      delete input.columns
    }
    if (input) Object.assign(this, input)
    
    for (const row of this.rows) this._rowMap.set(row.rowKey, row)
    for (const col of this.columns) this._colMap.set(col.columnKey, col)

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
      cellMeta        : g.cellMeta
    }
    if (typeof input?.dataGridID === 'undefined'){
      props.dataGridID = `${g.dataGridID}-clone-${Randomish()}`
    }
    return new GridDataSource(Object.assign(props, input))
  }

  public static cloneSource(g: IGridDataSource, input?: Partial<IGridDataSource>) {
    const source = GridDataSource.cloneMeta(g, input)
    source.setRows(g.rows.map(row => row.clone()))
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
        if (this._rowsSubset) {
          if (index > -1) {
            this._rowsSubset.splice(index, 0, row)
            // find the index of the closest row in the underlying rows
            let underlyingIndex = this._rows.findIndex(r => r.rowKey === this._rowsSubset![index - 1]?.rowKey)
            if (underlyingIndex === -1) underlyingIndex = this._rows.findIndex(r => r.rowKey === this._rowsSubset![index + 1]?.rowKey)
            if (underlyingIndex === -1) underlyingIndex = 0
            this._rows.splice(underlyingIndex, 0, row)
          }
          else {
            this._rowsSubset.push(row)
            this._rows.push(row)
          }
        } else {
          if (index > -1) this._rows.splice(index, 0, row)
          else this._rows.push(row)
        }
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
      const index = this._rows.indexOf(row)
      if (index > -1) this._rows.splice(index, 1)
      if (this._rowsSubset) {
        const subsetIndex = this._rowsSubset.indexOf(row)
        if (subsetIndex > -1) this._rowsSubset.splice(subsetIndex, 1)
      }
      this._rowMap.delete(row.rowKey)
    }
    this._changesStream.next()
  }

  public setColumns(columns: IGridColumn[], subset = false): void {
    if (subset) this._columnsSubset = columns
    else {
      if (this._columnsSubset) {
        console.warn('The subset of columns should be cleared')
      }
      this._columns = columns
    }
    this._colMap.clear()
    for (const col of columns) this._colMap.set(col.columnKey, col)
    this._changesStream.next()
  }

  public setRows(rows: IGridRow[], subset = false): void {
    if (subset) this._rowsSubset = rows
    else {
      this._rows = rows
      this._rowMap.clear()
    }
    for (const row of rows) this._rowMap.set(row.rowKey, row)
    this._changesStream.next()
  }

  public getUnderlyingColumns(): IGridColumn[] {
    return this._columns
  }

  public getUnderlyingRows(): IGridRow[] {
    return this._rows
  }

  public clearRowSubset(): void {
    this._rowsSubset = undefined
    this._changesStream.next()
  }
  public clearColumnSubset(): void {
    this._columnsSubset = undefined
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

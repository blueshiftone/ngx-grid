import { Subject, SubscriptionLike } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { GenericTransformer } from './controller/transform-pipeline/generic-transformer'
import { RowPipeline } from './controller/transform-pipeline/row-pipeline'
import { Transformer } from './controller/transform-pipeline/transformer.abstract'
import { EMetadataType } from './typings/enums'
import { IGridCellMeta, IGridCellValue, IGridColumn, IGridDataSource, IGridMetadataCollection, IGridRow } from './typings/interfaces'
import { GridCellCoordinates, GridCellValue, GridMetadataCollection } from './typings/interfaces/implementations'
import { GridImplementationFactory } from './typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from './typings/types/column-key.type'
import { TPrimaryKey } from './typings/types/primary-key.type'
import { Randomish } from './utils/randomish'

export class GridDataSource implements IGridDataSource {

  private _columns: IGridColumn[] = []

  public get columns(): IGridColumn[] {
    return this._columnsSubset ?? this._columns
  }

  private _underlyingRows: IGridRow[] = []

  private _rows = new RowPipeline()

  public get rows() {
    return this._rows
  }
  public set rows(_: RowPipeline) {
    throw new Error('Cannot set rows directly.')
  }
  
  // first step in the row pipeline, just sets the rows
  public initialTransform = new GenericTransformer<IGridRow>('InitialRows', async () => this._underlyingRows)
  
  private _columnsSubset?: IGridColumn[]

  public dataSetName      = ''
  public dataGridID       = ''
  public primaryColumnKey = 'ID'
  public disabled         = false
  public maskNewIds       = false
  public leafLevel        = -1
  
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
      this.setRows(input.rows.latestValue)
      delete input.rows
    }
    if (input?.columns) {
      this.setColumns(input.columns)
      delete input.columns
    }
    if (input) Object.assign(this, input)
    
    for (const col of this.columns) this._colMap.set(col.columnKey, col)

    this.initialTransform.value = this._underlyingRows
    this.rows.addTransformation(this.initialTransform)

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
    source.setRows((g.rows.firstValue).map(row => row.clone()))
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

  public addRow(row: IGridRow) {
    this._rowMap.set(row.rowKey, row)
  }

  public upsertRows(rows: IGridRow[]) {
    for (const row of rows) {
      const existingRow = this.getRow(row.rowKey)
      if (existingRow) {
        for (const [key, val] of row.values) {
          existingRow.setValue(key, val.value)
        }
      } else {
        this.insertNewRows(row)
      }
    }
  }

  public insertNewRows(rows: IGridRow[]): void
  public insertNewRows(...rows: IGridRow[]): void
  public insertNewRows(index: number, ...rows: IGridRow[]): void
  public insertNewRows(indexRowOrRows: number | IGridRow | IGridRow[], ...rows: IGridRow[]): void {

    const effectiveTail = this.rows.getEffectiveTail()
    const effectiveTailValue = effectiveTail?.value ?? []
    
    if (Array.isArray(indexRowOrRows)) rows = indexRowOrRows
    else if (typeof indexRowOrRows === 'object') rows.unshift(indexRowOrRows)
    
    const index = Number.isInteger(indexRowOrRows) ? (indexRowOrRows as number) : effectiveTailValue.length

    for (const row of rows) {
      if (this.getRow(row.rowKey)) {
        throw new Error(`Cannot insert row with key ${row.rowKey} because it already exists.`)
      }
      this.addRow(row)
    }

    const referenceRowKey = this.rows.latestValue[index]?.rowKey

    if (effectiveTail) {
      const effectiveTailValue = effectiveTail.value
      effectiveTailValue.splice(index, 0, ...rows)
      this.rows.output.next([...effectiveTailValue])
    }

    let transform: Transformer<IGridRow> | undefined = this.initialTransform

    // loop through the transformations and insert the row at the index of the referenceRowKey if possible
    while (transform !== undefined) {

      if (
        // skip the effective tail because we already inserted the rows there
        transform === effectiveTail ||
        // skip any transformers that don't have their own value because they are just passing through the value of the previous transformer
        !transform.hasOwnValue
      ) {
        transform = transform.next()
        continue
      }

      const value = transform.value
      if (referenceRowKey === undefined) {
        // if there is no referenceRowKey, insert the rows at the end
        value.push(...rows)
      } else {
        // otherwise, insert the rows at the index of the referenceRowKey
        const index = value.findIndex(r => r.rowKey === referenceRowKey)
        if (index >= 0) {
          value.splice(index, 0, ...rows)
        } else {
          // if the referenceRowKey is not found, insert the rows at the end
          value.push(...rows)
        }
      }
      transform = transform.next()
    }

    this._changesStream.next()
  }

  public removeRows(...rows: (TPrimaryKey | IGridRow)[]): void {
    
    const effectiveTail = this.rows.getEffectiveTail()

    for (let row of rows) {
      if (typeof row !== 'object') {
        const existingRow = this.getRow(row)
        if (!existingRow) return
        row = existingRow
      }
      const { rowKey } = row
      let transform: Transformer<IGridRow> | undefined = this.initialTransform
      while (transform !== undefined) {
        if (!transform.hasOwnValue) {
          transform = transform.next()
          continue
        }
        const index = transform.value.findIndex(r => r.rowKey === rowKey)
        if (index > -1) transform.value.splice(index, 1)
        if (transform === effectiveTail) {
          this.rows.output.next([...transform.value])
        }
        transform = transform.next()
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
    if (!subset) this._colMap.clear()
    for (const col of columns) this._colMap.set(col.columnKey, col)
    this._changesStream.next()
  }

  public setRows(rows: IGridRow[]): void {
    this._underlyingRows = rows
    this._rowMap.clear()
    this.initialTransform.touch()
    
    for (const row of rows) this._rowMap.set(row.rowKey, row)
    this._changesStream.next()
  }

  public hasColumnSubset() {
    return this._columnsSubset !== undefined
  }

  public getUnderlyingColumns(): IGridColumn[] {
    return this._columns
  }

  public clearColumnSubset(): void {
    this._columnsSubset = undefined
    this._changesStream.next()
  }

  public clearRows(): void {
    this._rowMap.clear()
    this.rows.reset()
    this._changesStream.next()
  }

  public onDestroy(): void {
    this.rows.destroyed.next()
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

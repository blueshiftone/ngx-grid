import { GridCellCoordinates } from '.'
import { IGridCellCoordinates, IGridCellEdges, IGridRow, IGridSelectionBoundingPosition, IGridSelectionRange } from '..'
import { IGridEventsFactory } from '../../../events/grid-events.service'
import { SetDifference } from '../../../utils/difference-between-sets'
import { TColumnKey, TPrimaryKey } from '../../types'

export class GridSelectionRange implements IGridSelectionRange {
  
  public multiSelect: boolean
  private _rowMap     : Map<TPrimaryKey, Set<TColumnKey>>
  private _colMap     : Map<TColumnKey, Set<TPrimaryKey>>

  public secondarySelection: IGridSelectionRange | null = null

  public isSubtracting = false

  constructor(
    private readonly gridEvents: IGridEventsFactory,
    input?: Partial<IGridSelectionRange>,
    rowMap?: Map<TPrimaryKey, Set<TColumnKey>>,
    colMap?: Map<TColumnKey, Set<TPrimaryKey>>
  ) {
    this.secondarySelection = typeof input?.secondarySelection !== 'undefined' ? input.secondarySelection : null
    this.multiSelect        = typeof input?.multiSelect        !== 'undefined' ? input.multiSelect : false
    this.isSubtracting      = typeof input?.isSubtracting      !== 'undefined' ? input.isSubtracting : false

    this._rowMap             = typeof rowMap !== 'undefined' ? rowMap : new Map()
    this._colMap             = typeof colMap !== 'undefined' ? colMap : new Map()
  }

  public remove(cell: IGridCellCoordinates): GridSelectionRange {

    const rowMapOfColumns = this._rowMap.get(cell.rowKey)
    const columnMapOfRows = this._colMap.get(cell.columnKey)

    rowMapOfColumns?.delete(cell.columnKey)
    columnMapOfRows?.delete(cell.rowKey)

    if (!rowMapOfColumns?.size) this._rowMap.delete(cell.rowKey)
    if (!columnMapOfRows?.size) this._colMap.delete(cell.columnKey)

    return this
  }

  public add(cell: IGridCellCoordinates) {

    if (!this._rowMap.get(cell.rowKey)) {
      this._rowMap.set(cell.rowKey, new Set())
    }
    this._rowMap.get(cell.rowKey)!.add(cell.columnKey)   

    if (!this._colMap.get(cell.columnKey)) this._colMap.set(cell.columnKey, new Set())
    this._colMap.get(cell.columnKey)!.add(cell.rowKey)

    return this
  }
  
  public includes       = (cell: IGridCellCoordinates) => this._rowMap.get(cell.rowKey)?.has(cell.columnKey) === true
  public includesRow    = (rowKey: TPrimaryKey) => this.rows.has(rowKey)
  public includesColumn = (columnKey: TColumnKey) => this.columns.has(columnKey)
  
  public addRange(start: IGridCellCoordinates, end: IGridCellCoordinates) {
    this.getRange(start, end).forEach(cell => this.add(cell))
    return this
  }
  
  public toggleRange(start: IGridCellCoordinates, end: IGridCellCoordinates) {
    this.getRange(start, end).forEach(cell => {
      if (this.includes(cell)) this.remove(cell)
      else this.add(cell)
    })
    return this
  }

  public removeRange(start: IGridCellCoordinates, end: IGridCellCoordinates) {
    this.getRange(start, end).forEach(cell => this.remove(cell))
    return this
  }

  public get coordinatesAt() {
    if (!this._rowMap.size) return {
      topLeft    : () => { return new GridCellCoordinates(0, '') },
      topRight   : () => { return new GridCellCoordinates(0, '') },
      bottomRight: () => { return new GridCellCoordinates(0, '') },
      bottomLeft : () => { return new GridCellCoordinates(0, '') }
    }
    const maxRowKey    = () => this.globalUtils.getRowKeyFromIndex(Math.max(...this.rowIndexes)) || ''
    const minRowKey    = () => this.globalUtils.getRowKeyFromIndex(Math.min(...this.rowIndexes)) || ''
    const maxColumnKey = (rowKey: TPrimaryKey) => this.globalUtils.getColumnKeyFromIndex(Math.max(...[...this._rowMap.get(rowKey) || []].map(columnName => this.globalUtils.getColumnIndex(columnName))))
    const minColumnKey = (rowKey: TPrimaryKey) => this.globalUtils.getColumnKeyFromIndex(Math.min(...[...this._rowMap.get(rowKey) || []].map(columnName => this.globalUtils.getColumnIndex(columnName))))
    return {
      topLeft: () => {
        const rowKey = minRowKey()
        return new GridCellCoordinates(rowKey, minColumnKey(rowKey))
      },
      topRight: () => {
        const rowKey = minRowKey()
        return new GridCellCoordinates(rowKey, maxColumnKey(rowKey))
      },
      bottomRight: () => {
        const rowKey = maxRowKey()
        return new GridCellCoordinates(rowKey, maxColumnKey(rowKey))
      },
      bottomLeft: () => {
        const rowKey = maxRowKey()
        return new GridCellCoordinates(rowKey, minColumnKey(rowKey))
      },
    }
  }

  public getBounds() {
    const output = {
      topLeft    : this.coordinatesAt.topLeft() as IGridSelectionBoundingPosition,
      topRight   : this.coordinatesAt.topRight() as IGridSelectionBoundingPosition,
      bottomRight: this.coordinatesAt.bottomRight() as IGridSelectionBoundingPosition,
      bottomLeft : this.coordinatesAt.bottomLeft() as IGridSelectionBoundingPosition,
    }
    output.topLeft.opposite     = output.bottomRight
    output.topRight.opposite    = output.bottomLeft
    output.bottomRight.opposite = output.topLeft
    output.bottomLeft.opposite  = output.topRight
    return output
  }

  public isEqual(s: IGridSelectionRange | null): boolean {
    if (!s || ((!s.secondarySelection && this.secondarySelection) || (s.secondarySelection && !this.secondarySelection))) return false
    const rowDiff = SetDifference(this.rows, s.rows)
    const colDiff = SetDifference(this.columns, s.columns)
    return !rowDiff.length && !colDiff.length && (!this.secondarySelection || this.secondarySelection.isEqual(s.secondarySelection))
  }

  public get cellCount(): number {
    let output = 0
    for (const cells of this._rowMap.values()) output += cells.size
    return output
  }

  public get rows(): Set<TPrimaryKey> { return new Set(this._rowMap.keys()) }
  public get columns(): Set<TColumnKey> { return new Set(this._colMap.keys()) }

  public get rowKeys(): Array<TPrimaryKey> { return [...this._rowMap.keys()] }
  public get columnKeys()    : Array<TColumnKey> { return [...this._colMap.keys()] }
  public get rowIndexes()    : Array<number> { return [...this._rowMap.keys()].map(rowKey => this.globalUtils.getRowIndex(rowKey)) }
  public get columnIndexes() : Array<number> { return [...this._colMap.keys()].map(columnKey => this.globalUtils.getColumnIndex(columnKey)) }

  public getRange(start: IGridCellCoordinates, end: IGridCellCoordinates) {
    const output: IGridCellCoordinates[] = []
    const startIndex = this._coordsToIndexes(start)
    const endIndex = this._coordsToIndexes(end)
    const x = [startIndex, endIndex].sort((a, b) => a.columnIndex - b.columnIndex)
    const y = [startIndex, endIndex].sort((a, b) => a.rowIndex - b.rowIndex)
    const a = { rowKey: y[0].rowIndex, x: x[0].columnIndex }
    const b = { rowKey: y[1].rowIndex, x: x[1].columnIndex }
    for (let rowIndex = a.rowKey; rowIndex <= b.rowKey; rowIndex++) {
      for (let colIndex = a.x; colIndex <= b.x; colIndex++) {
        output.push(new GridCellCoordinates(this.globalUtils.getRowKeyFromIndex(rowIndex) ?? '', this.globalUtils.getColumnKeyFromIndex(colIndex)))
      }
    }
    return output
  }

  public edgesOf(cell: IGridCellCoordinates): IGridCellEdges {
    const isSelected = this.includes(cell)
    return {
      top   : isSelected &&  !this.includes(new GridCellCoordinates(this.globalUtils.incrementRow(cell.rowKey, -1), cell.columnKey)),
      left  : isSelected &&  !this.includes(new GridCellCoordinates(cell.rowKey, this.globalUtils.incrementColumn(cell.columnKey, -1))),
      right : isSelected && (!this.includes(new GridCellCoordinates(cell.rowKey, this.globalUtils.incrementColumn(cell.columnKey, 1))) || this.globalUtils.incrementColumn(cell.columnKey, 1) === cell.columnKey),
      bottom: isSelected && (!this.includes(new GridCellCoordinates(this.globalUtils.incrementRow(cell.rowKey, 1), cell.columnKey))    || this.globalUtils.incrementRow(cell.rowKey, 1) === cell.rowKey),
    }
  }

  public colsAt(rowKey: TPrimaryKey): Set<TColumnKey> {
    return this._rowMap.get(rowKey) || new Set()
  }

  public rowsAt(columnName: TColumnKey): Set<TPrimaryKey> {
    return this._colMap.get(columnName) || new Set()
  }

  public clone(): IGridSelectionRange {
    return new GridSelectionRange(
      this.gridEvents,
      {
        secondarySelection: this.secondarySelection?.clone() || null,
        multiSelect: this.multiSelect,
        isSubtracting: this.isSubtracting,
        rows: new Set(this.rows),
        columns: new Set(this.columns),
      }, 
      this._deepCloneMap(this._rowMap),
      this._deepCloneMap(this._colMap)
    )
  }

  public changePrimaryKey  (oldKey: TPrimaryKey, newKey: TPrimaryKey) {
    for (const [_, rowKeys] of this._colMap.entries()) {
      if (rowKeys.has(oldKey)) {
        rowKeys.delete(oldKey)
        rowKeys.add(newKey)
      }
    }
    for (const [rowKey, columnKeys] of this._rowMap.entries()) {
      if (rowKey === oldKey) {
        this._rowMap.delete(rowKey)
        this._rowMap.set(newKey, columnKeys)
      }
    }
    if (this.secondarySelection) this.secondarySelection.changePrimaryKey(oldKey, newKey)
  }

  public allCellCoordinates(): IGridCellCoordinates[] {
    const output: IGridCellCoordinates[] = []
    for (const [rowKey, columnKeys] of this._rowMap.entries())
      output.push(...Array.from(columnKeys).map(columnKey => new GridCellCoordinates(rowKey, columnKey)))
    return output
  }

  public globalUtils = {
    getRowKeyFromIndex: (rowIndex: number): TPrimaryKey | undefined => {
      return this._visibleRows[rowIndex]?.rowKey
    },
    getColumnKeyFromIndex: (columIndex: number): TColumnKey => {
      return this._visibleColumns[columIndex]
    },
    getRowIndex: (rowKey: TPrimaryKey): number => {
      if (!rowKey) {
        console.warn(`Undefined or null row key when getting row index`);        
        return -1
      }
      const row = this.globalUtils.getRowFromRowKey(rowKey)
      if (!row) throw new Error(`Unable to find row for key ${rowKey}`)
      return this._visibleRows.indexOf(row)
    },
    getRowFromRowKey: (rowKey: TPrimaryKey): IGridRow | undefined => {
      return this.gridEvents.GridDataChangedEvent.state?.getRow(rowKey)
    },
    getColumnIndex: (columnKey: TColumnKey): number => {
      return this._visibleColumns.indexOf(columnKey)
    },
    getFirstColumn: (): TColumnKey => {
      return this.globalUtils.getColumnKeyFromIndex(0)
    },
    getLastColumn: (): TColumnKey => {
      return this.globalUtils.getColumnKeyFromIndex(this._visibleColumns.length - 1)
    },
    getFirstRow: (): TPrimaryKey => {
      return this.globalUtils.getRowKeyFromIndex(0) || ''
    },
    getLastRow: (): TPrimaryKey => {
      return this.globalUtils.getRowKeyFromIndex(this._visibleRows.length -1) || ''
    },
    incrementRow: (rowKey: TPrimaryKey, increment = 1): TPrimaryKey => {
      const rowIndex = Math.max(0, Math.min(this._visibleRows.length - 1, this.globalUtils.getRowIndex(rowKey) + increment))
      return this.globalUtils.getRowKeyFromIndex(rowIndex) ?? rowKey
    },  
    incrementColumn: (columnKey: TColumnKey, increment = 1) => {
      const cols = this._visibleColumns
      return cols[Math.max(0, Math.min(cols.length - 1, cols.indexOf(columnKey) + increment))] ?? columnKey
    }
  }

  private _coordsToIndexes(coords: IGridCellCoordinates) {
    return {
      rowIndex: this.globalUtils.getRowIndex(coords.rowKey),
      columnIndex: this.globalUtils.getColumnIndex(coords.columnKey),
    }
  }

  private _deepCloneMap<TKey, TValue>(m: Map<TKey, Set<TValue>>): Map<TKey, Set<TValue>> {
    const output: Map<TKey, Set<TValue>> = new Map()
    for (const entry of m.entries()) output.set(entry[0], new Set(entry[1]))
    return output
  }

  private get _visibleColumns(): TColumnKey[] {
    return this.gridEvents.ColumnsUpdatedEvent.state?.visibleColumns || []
  }

  private get _visibleRows(): IGridRow[] {
    return this._filteredRows ?? this._sortedRows ?? this._source?.rows ?? []
  }

  private get _source() {
    return this.gridEvents.GridDataChangedEvent.state
  }

  private get _sortedRows() {
    return this.gridEvents.ColumnSortByChangedEvent.state?.rows
  }

  private get _filteredRows() {
    return this.gridEvents.RowsFilteredEvent.state
  }

}

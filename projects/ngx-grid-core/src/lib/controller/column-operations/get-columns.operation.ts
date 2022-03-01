import { merge, Subscription } from 'rxjs'

import { IGridColumnMeta, IGridColumnOrder } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { ArraysAreEqual } from '../../utils/arrays-are-equal'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumns extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) {
    super(factory)
    
    this.subs.add(merge(
      this.gridEvents.ColumnOrderChangedEvent.on(),
      this.gridEvents.GridDataChangedEvent.on()
    ).pipe(removeNullish()).subscribe(_ => this._updateColumns()))
  }

  private readonly subs   : Set<Subscription> = new Set()
  private _visibleColumns : string[] = []
  private _columns        : string[] = []

  public override onDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  public run(): string[] {
    return this._visibleColumns
  }

  private _updateColumns(): void {
    if (typeof this._source === 'undefined') return

    let   keys         = [...this._source.allColumnKeys]
    const savedOrder   = this._savedOrder
    const defaultOrder = this._colMeta
      .filter(m => m.sortOrder !== undefined)
      .map<IGridColumnOrder>(m => ({ columnKey: m.columnKey, order: m.sortOrder as number }))
      .filter(itm => !savedOrder.find(saved => saved.columnKey === itm.columnKey))
      
    const order = [...savedOrder, ...defaultOrder].filter(k => [...keys].includes(k.columnKey))

    keys = keys.filter(k => !order.map(k => k.columnKey).includes(k))
    order.sort((a, b) => a.order - b.order)

    let maxSort = Math.max(...order.map(v => v.order)) + 1

    order.push(...keys.map<IGridColumnOrder>(columnName => ({ columnKey: columnName, order: maxSort++ })))
    order.forEach((o, i) => o.order = i)

    this._columns        = order.map(o => o.columnKey)
    this._visibleColumns = this._columns.filter(k => this._visibleColumnsConfig.includes(k))

    const lastColumns = this._getLastColumnsUpdatedEvent()

    if (
      !lastColumns ||
      !ArraysAreEqual(this._columns, lastColumns.allColumns) || 
      !ArraysAreEqual(this._visibleColumns, lastColumns.visibleColumns)
    ) {
      this.gridEvents.ColumnsUpdatedEvent.emit({
        allColumns: [...this._columns],
        visibleColumns: [...this._visibleColumns]
      })
    }

  }

  private get _source() { return this.gridOperations.source() }

  private get _savedOrder() {
    return this.columnOperations.prefsService.get<IGridColumnOrder[]>(this.columnOperations.getPrefsKey('GridColumnSortOrder'), [])
  }

  private get _colMeta(): IGridColumnMeta[] {
    return this._source?.columnMeta || []
  }

  private get _visibleColumnsConfig(): string[] {
    return (this._source?.visibleColumns ?? this._source?.allColumnKeys ?? []).filter(col => !(this._source?.hiddenColumns ?? []).includes(col))
  }

  private _getLastColumnsUpdatedEvent() {
    return this.gridEvents.ColumnsUpdatedEvent.state
  }

}

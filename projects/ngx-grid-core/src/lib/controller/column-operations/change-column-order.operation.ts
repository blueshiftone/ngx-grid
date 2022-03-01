import { IGridColumnOrder, IGridColumns } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class ChangeColumnOrder extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(changedIndexes: [number, number]) {
    let   [prevIndex, nextIndex]   = changedIndexes
    let   prevIndexStart: number   = prevIndex
    const indexesChanged: number[] = []
    
    if (prevIndexStart < nextIndex) while (prevIndexStart <= nextIndex) indexesChanged.push(prevIndexStart++)
    else                            while (prevIndexStart >= nextIndex) indexesChanged.push(prevIndexStart--)

    const columns: IGridColumnOrder[]= indexesChanged.map(i => ({
      order    : this._columns.indexOf(this._visibleColumns[i]),
      columnKey: this._visibleColumns[i]
    }))

    const newOrder = columns.map(i => i.order)

    newOrder.unshift(newOrder.pop() as number)
    columns.forEach((el, i) => el.order = newOrder[i])

    const savedOrder = [...this._savedOrder.filter(o => !columns.map(c => c.columnKey).includes(o.columnKey)), ...columns]

    this.columnOperations.prefsService.set(this._prefsKey, savedOrder)
    
    this.gridEvents.ColumnOrderSavedEvent.emit(savedOrder)
    this.gridEvents.ColumnOrderChangedEvent.emit(columns)
  }

  private get _columns(): string[] {
    return this._latestGridColumns?.allColumns || []
  }

  private get _visibleColumns(): string[] {
    return this._latestGridColumns?.visibleColumns || []
  }

  private get _latestGridColumns(): IGridColumns | undefined {
    return this.gridEvents.ColumnsUpdatedEvent.state
  }

  private get _savedOrder() {
    return this.columnOperations.prefsService.get<IGridColumnOrder[]>(this._prefsKey, [])
  }

  private get _prefsKey(): string {
    return this.columnOperations.getPrefsKey('GridColumnSortOrder')
  }

}

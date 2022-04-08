import { IGridColumnOrder, IGridColumns } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class ChangeColumnOrder extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

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

    const newOrderIndexes = columns.map(i => i.order)

    newOrderIndexes.unshift(newOrderIndexes.pop() as number)
    columns.forEach((el, i) => el.order = newOrderIndexes[i])

    const savedColumnKeys = this._savedOrder.map(c => c.columnKey)
    const currentOrder = [...this._savedOrder, ...this._visibleColumns.map((c, i) => ({ order: i, columnKey: c })).filter(itm => !savedColumnKeys.includes(itm.columnKey))]

    const newOrder = currentOrder.map(c => columns.find(itm => itm.columnKey === c.columnKey) ?? c)

    this.columnOperations.prefsService.set(this._prefsKey, newOrder)
    
    this.gridEvents.ColumnOrderSavedEvent.emit(newOrder)
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

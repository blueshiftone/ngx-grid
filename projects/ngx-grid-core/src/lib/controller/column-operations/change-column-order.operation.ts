import { IGridColumn } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class ChangeColumnOrder extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  private _updateColumnOrder(changedColumns: Map<TColumnKey, number>) {
    // changedColumns.forEach((order, columnKey) => {
    //   let columnMeta = this.columnOperations.GetColumnMeta.run(columnKey)
    //   if (!columnMeta) {
    //     columnMeta = {
    //       columnKey,
    //       metadata: GridImplementationFactory.gridMetadataCollection()
    //     }
    //     this.dataSource.columnMeta.set(columnKey, columnMeta)
    //   }
    //   columnMeta.sortOrder = order
    // })
  }

  public allColumns(columns: TColumnKey[]) {
    const changedColumns = new Map<TColumnKey, number>()
    columns.forEach((columnKey, i) => changedColumns.set(columnKey, i))
    this.gridEvents.ColumnOrderChangedEvent.emit(changedColumns)
  }

  public run(changedIndexes: [number, number]) {
    let   [prevIndex, nextIndex]   = changedIndexes
    let   prevIndexStart: number   = prevIndex
    const indexesChanged: number[] = []
    
    if (prevIndexStart < nextIndex) while (prevIndexStart <= nextIndex) indexesChanged.push(prevIndexStart++)
    else                            while (prevIndexStart >= nextIndex) indexesChanged.push(prevIndexStart--)

    const changedColumns = new Map<TColumnKey, number>()

    // for (const i of indexesChanged) {
    //   const order = this._columns.indexOf(this._visibleColumns[i]),
    //   const columnKey = this._visibleColumns[i]
    //   changedColumns.set(columnKey, order)
    // }

    // console.log(indexesChanged, changedColumns)

    // const newOrderIndexes = changedColumns.map(i => i.order)

    // newOrderIndexes.unshift(newOrderIndexes.pop() as number)
    // changedColumns.forEach((el, i) => el.order = newOrderIndexes[i])

    // const currentOrder = this._visibleColumns.map((c, i) => ({ order: i, columnKey: c }))

    // const newOrder = currentOrder.map(c => changedColumns.find(itm => itm.columnKey === c.columnKey) ?? c)
    
    // this.gridEvents.ColumnOrderChangedEvent.emit(changedColumns)
  }

  private get _columns(): IGridColumn[] {
    return this.dataSource.columns
  }

}

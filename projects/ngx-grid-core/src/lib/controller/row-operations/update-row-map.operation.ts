import { IGridDataSource } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class UpdateRowMap extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(source: IGridDataSource | undefined = this.gridOperations.source()): void {

    const rowMap = this.rowOperations.rowKeyMap

    rowMap.clear()

    if (!source) return

    const pkIndex = source.data.value.columns.indexOf(source.primaryColumnKey)

    if (pkIndex < 0) return

    source.data.value.rows.forEach(row => {
      rowMap.set(row.rowKey, row)
    })

    this.gridEvents.RowKeyMapChangedEvent.emit(rowMap)
    
  }

}

import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetAllRows extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public allRows(): IGridRow[] {
    return this._sortedRows ?? this.gridOperations.source()?.data.value.rows ?? []
  }

  public filteredRows(): IGridRow[] {
    return this._filteredRows ?? this._sortedRows ?? this.gridOperations.source()?.data.value.rows ?? []
  }

  private get _sortedRows() {
    return this.gridEvents.ColumnSortByChangedEvent.state?.rows || null
  }

  private get _filteredRows() {
    return this.gridEvents.RowsFilteredEvent.state || null
  }
}

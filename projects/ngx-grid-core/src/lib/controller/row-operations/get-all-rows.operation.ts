import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetAllRows extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public allRows(): IGridRow[] {
    return this._sortedRows ?? this.dataSource.rows
  }

  public filteredRows(): IGridRow[] {
    return this._filteredRows ?? this.allRows()
  }

  private get _sortedRows() {
    return this.gridEvents.ColumnSortByChangedEvent.state?.rows ?? null
  }

  private get _filteredRows() {
    return this.gridEvents.RowsFilteredEvent.state ?? null
  }
}

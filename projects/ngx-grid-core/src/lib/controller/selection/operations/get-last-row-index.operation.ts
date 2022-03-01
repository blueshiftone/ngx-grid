import { GridSelectionController } from '../grid-selection.controller'

export class GetLastRowIndexOperation {

  constructor(private readonly controller: GridSelectionController) { }

  public run(): number {
    return ((this._filteredRows?.length ?? this._sortedRows?.length ?? this._source?.data.value.rows.length) || 1) - 1
  }

  private get _source() {
    return this.controller.gridEvents.GridDataChangedEvent.state
  }

  private get _sortedRows() {
    return this.controller.gridEvents.ColumnSortByChangedEvent.state?.rows || null
  }

  private get _filteredRows() {
    return this.controller.gridEvents.RowsFilteredEvent.state || null
  }

}
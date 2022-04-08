import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class FilterRows extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(filter?: string | null): IGridRow[] {
    if (typeof filter === 'undefined') filter = this._getFilterString()
    const rows = this.rowOperations.GetAllRows.allRows()
    let filtered: IGridRow[] = []
    if (filter) { 
      filter = filter.toLowerCase()
      filtered = rows.filter(row => row.valuesArray.map(v => v.value).join('').toLowerCase().includes(filter!))
      this.gridEvents.RowsFilteredEvent.emit(filtered)
    } else if (this._getRowsFilteredEvent() !== null && typeof this._getRowsFilteredEvent() !== 'undefined') {
      this.gridEvents.RowsFilteredEvent.emit(null)
    }
    this.gridEvents.GridDataChangedEvent.emit(this.gridEvents.GridDataChangedEvent.state!)
    return filtered
  }

  private _getFilterString(): string {
    return this.gridEvents.GridFilterStringChangedEvent.state ?? ''
  }

  private _getRowsFilteredEvent() {
    return this.gridEvents.RowsFilteredEvent.state
  }

}

import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { IGridRow, IGridSorted } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class SortColumn extends BaseColumnOperation {

  public sortBy: IGridSorted | null = null
  
  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnKey: string) {    
    const currentSort: ESortDirection = this.sortBy?.columnName === columnKey ? this.sortBy.sortOrder : ESortDirection.Natural
    const sortOrder                   = ESortDirection[currentSort + 1] ? currentSort + 1 : 0
    
    this.sortBy  = sortOrder === ESortDirection.Natural ? null : { columnName: columnKey, sortOrder: sortOrder }

    let   rowsSorted: IGridRow[] | null    = null

    if (this.sortBy) {
      if (typeof this._rows[0].getValue(columnKey).value === 'string') {
        rowsSorted = [...this._rows].sort((a, b) => {
          if (this.sortBy!.sortOrder === ESortDirection.ASC) return (a.getValue(columnKey)?.value ?? '').localeCompare(b.getValue(columnKey)?.value ?? '')
          else return (b.getValue(columnKey)?.value ?? '').localeCompare(a.getValue(columnKey)?.value ?? '')
        })
      } else {
        rowsSorted = [...this._rows].sort((a, b) => {
          if (this.sortBy!.sortOrder === ESortDirection.ASC) return (a.getValue(columnKey)?.value ?? 0) - (b.getValue(columnKey)?.value ?? 0)
          else return (b.getValue(columnKey)?.value ?? 0) - (a.getValue(columnKey)?.value ?? 0)
        })
      }
      this.sortBy.rows = rowsSorted
    }
    
    this.gridEvents.ColumnSortByChangedEvent.emit(this.sortBy)
  }

  private get _source() {
    return this.gridEvents.GridDataChangedEvent.state
  }

  private get _rows(): IGridRow[] {
    return this._source?.data.value.rows || []
  }

}

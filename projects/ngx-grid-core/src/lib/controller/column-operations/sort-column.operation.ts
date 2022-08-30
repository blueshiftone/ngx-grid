import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { IFieldSortConfig, IGridRow } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SortColumn extends Operation {
  
  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(fields: IFieldSortConfig[]): void
  public run(field: IFieldSortConfig): void
  public run(columnKey: string, direction: ESortDirection): void
  public run(input: string | IFieldSortConfig | IFieldSortConfig[], direction?: ESortDirection): void {
    
    let fields: IFieldSortConfig[] = []
    if (typeof input === 'string') {
      fields = [{ columnName: input, direction: direction!, sortIndex: 0 }]
    } else if (Array.isArray(input)) {
      fields = input
    } else {
      fields = [input]
    }

    this.gridOperations.gridController.workers.sortRecords.run({ records: this._rows, sortConfig: fields }).then((sortedRecords) => {
      console.log(sortedRecords);
    })

    // const currentSort: ESortDirection = this.sortBy?.columnName === columnKey ? this.sortBy.direction : ESortDirection.Natural
    // const sortOrder                   = ESortDirection[currentSort + 1] ? currentSort + 1 : 0
    
    // this.sortBy  = sortOrder === ESortDirection.Natural ? null : { columnName: columnKey, direction: sortOrder }

    // let   rowsSorted: IGridRow[] | null    = null

    // if (this.sortBy) {
    //   if (typeof this._rows[0].getValue(columnKey).value === 'string') {
    //     rowsSorted = [...this._rows].sort((a, b) => {
    //       if (this.sortBy!.direction === ESortDirection.Asc) return (a.getValue(columnKey)?.value ?? '').localeCompare(b.getValue(columnKey)?.value ?? '')
    //       else return (b.getValue(columnKey)?.value ?? '').localeCompare(a.getValue(columnKey)?.value ?? '')
    //     })
    //   } else {
    //     rowsSorted = [...this._rows].sort((a, b) => {
    //       if (this.sortBy!.direction === ESortDirection.Asc) return (a.getValue(columnKey)?.value ?? 0) - (b.getValue(columnKey)?.value ?? 0)
    //       else return (b.getValue(columnKey)?.value ?? 0) - (a.getValue(columnKey)?.value ?? 0)
    //     })
    //   }
    //   this.sortBy.rows = rowsSorted
    // }
    
    // this.gridEvents.ColumnSortByChangedEvent.emit(this.sortBy)
  }

  private get _rows(): IGridRow[] {
    return this.rowOperations.GetAllRows.allRows()
  }

}

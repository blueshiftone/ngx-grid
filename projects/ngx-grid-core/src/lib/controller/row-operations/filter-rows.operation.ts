import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class FilterRows extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(filter?: string | null): IGridRow[] {
    if (typeof filter === 'undefined') filter = this._getFilterString()
    const rows = this.dataSource.getUnderlyingRows()
    let filtered: IGridRow[] = []
    if (filter) { 
      filter = filter.toLowerCase()
      // Todo: filter foreign key values
      filtered = rows.filter(row => row.valuesArray.map(v => v.value.value).join('').toLowerCase().includes(filter!))
      this.dataSource.setRows(filtered, true)
    } else {
      this.dataSource.clearRowSubset()
    }
    return filtered
  }

  private _getFilterString(): string {
    return this.gridEvents.GridFilterStringChangedEvent.state ?? ''
  }

}

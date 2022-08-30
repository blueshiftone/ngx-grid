import { IFieldSortConfig, IGridRow } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class UpdateColumnSort extends Operation {
  
  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(rows: IGridRow[], fields: IFieldSortConfig[]): void {    
    
    this.gridEvents.ColumnSortByChangedEvent.emit({ rows, sortConfig: new Map(fields.map(itm => ([itm.columnName, itm]))) })

  }
}

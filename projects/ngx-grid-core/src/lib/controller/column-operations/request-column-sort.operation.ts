import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { IFieldSortConfig } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class RequestColumnSort extends Operation {
  
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

    this.gridEvents.ColumnSortByRequestedEvent.emit(fields)

  }
}

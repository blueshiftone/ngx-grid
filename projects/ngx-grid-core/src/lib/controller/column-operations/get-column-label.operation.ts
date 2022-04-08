import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetColumnLabel extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(columnKey: string): string {
    return this.columnOperations.GetColumnMeta.run(columnKey)?.name || columnKey
  }

}

import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumnLabel extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnKey: string): string {
    return this.columnOperations.GetColumnMeta.run(columnKey)?.name || columnKey
  }

}

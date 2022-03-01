import { IGridSeperator } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumnSeperators extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnKey: string): IGridSeperator[] {
    return this.columnOperations.GetColumnMeta.run(columnKey)?.seperators || []
  }

}

import { IGridSeparator } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumnSeparators extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnKey: string): IGridSeparator[] {
    return this.columnOperations.GetColumnMeta.run(columnKey)?.separators || []
  }

}

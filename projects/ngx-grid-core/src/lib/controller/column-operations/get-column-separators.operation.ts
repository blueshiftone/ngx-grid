import { IGridSeparator } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetColumnSeparators extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(columnKey: string): IGridSeparator[] {
    return this.columnOperations.GetColumnMeta.run(columnKey)?.separators || []
  }

}

import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetActualIndexOfColumn extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnName: string) {
    return this.gridOperations.source()?.allColumnKeys.indexOf(columnName) ?? -1
  }

}

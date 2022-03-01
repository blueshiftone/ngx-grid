import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { IGridRow } from '../../typings/interfaces/grid-row.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetRow extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(rowKey: TPrimaryKey): IGridRow | undefined {
    return this.rowOperations.rowKeyMap.get(rowKey)
  }

}

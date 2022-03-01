import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class ConvertRowKey extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(rowKey: TPrimaryKey): TPrimaryKey {
    if (typeof rowKey === 'string' && rowKey.match(/^[0-9]+$/)) return parseInt(rowKey, 10)
    return rowKey
  }

}

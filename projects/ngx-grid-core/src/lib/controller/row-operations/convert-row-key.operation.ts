import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class ConvertRowKey extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): TPrimaryKey {
    if (typeof rowKey === 'string' && rowKey.match(/^[0-9]+$/)) return parseInt(rowKey, 10)
    return rowKey
  }

}

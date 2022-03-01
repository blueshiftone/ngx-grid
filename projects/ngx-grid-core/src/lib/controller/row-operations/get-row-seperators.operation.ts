import { IGridSeperator } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetRowSeperators extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(primaryKey: TPrimaryKey): IGridSeperator[] {
    return this.rowOperations.GetRowMeta.run(primaryKey)?.seperators || []
  }

}

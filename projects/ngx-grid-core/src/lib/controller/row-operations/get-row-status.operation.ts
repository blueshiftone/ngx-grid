import { ERowStatus } from '../../typings/enums'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowStatus extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): ERowStatus | undefined {
    return this.rowOperations.GetRowMeta.run(rowKey)?.status
  }

}

import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { IGridRow } from '../../typings/interfaces/grid-row.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRow extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): IGridRow | undefined {
    return this.dataSource.getRow(rowKey)
  }

}

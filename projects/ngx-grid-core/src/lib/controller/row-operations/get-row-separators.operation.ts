import { IGridSeparator } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowSeparators extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(primaryKey: TPrimaryKey): IGridSeparator[] {
    return this.dataSource.getRow(primaryKey)?.separators || []
  }

}

import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetActualIndexOfColumn extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(columnName: string) {
    return this.dataSource.columns.indexOf(columnName) ?? -1
  }

}

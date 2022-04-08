import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetGridId extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): string {
    return this.dataSource.dataGridID ?? ''
  }

}

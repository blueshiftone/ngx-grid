import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetIsDisabled extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): boolean {
    return this.dataSource.disabled === true
  }
}

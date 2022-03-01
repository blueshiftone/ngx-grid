import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetIsDisabled extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): boolean {
    return this.gridOperations.source()?.disabled === true
  }
}

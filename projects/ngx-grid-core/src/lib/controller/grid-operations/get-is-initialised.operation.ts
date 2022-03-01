import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetIsInitialised extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): boolean {
    return this.gridEvents.GridInitialisedEvent.state === true
  }
}

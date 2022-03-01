import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class CheckViewportSize extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): void {   
    this.gridOperations.viewPort?.checkViewportSize()
  }

}

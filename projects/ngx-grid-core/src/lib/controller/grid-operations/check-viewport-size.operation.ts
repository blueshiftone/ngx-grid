import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class CheckViewportSize extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {   
    this.gridOperations.viewPort?.checkViewportSize()
  }

}

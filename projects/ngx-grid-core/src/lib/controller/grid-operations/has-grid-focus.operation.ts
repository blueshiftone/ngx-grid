import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class HasGridFocus extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): boolean {
    return this.controller.focusTracker.hasFocus(this.dataSource.dataGridID)
  }

}

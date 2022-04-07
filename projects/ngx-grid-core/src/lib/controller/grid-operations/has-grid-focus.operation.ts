import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { DATA_GRIDS_FOCUSED_TREE } from '../grid-controller.service'
import { Operation } from '../operation.abstract'

export class HasGridFocus extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): boolean {
    return DATA_GRIDS_FOCUSED_TREE[0] === this.dataSource.dataGridID || false
  }

}

import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { DATA_GRIDS_FOCUSED_TREE } from '../grid-controller.service'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class HasGridFocus extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): boolean {
    const source = this.gridOperations.source()
    return source && DATA_GRIDS_FOCUSED_TREE[0] === source.dataGridID || false
  }

}

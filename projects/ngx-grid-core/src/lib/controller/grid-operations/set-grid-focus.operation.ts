import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { DeleteFromArray } from '../../utils/array-delete'
import { DATA_GRIDS_FOCUSED_TREE } from '../grid-controller.service'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class SetGridFocus extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): void {
    const source = this.gridOperations.source()
    if (!source || this.gridOperations.GetIsDisabled.run()) return
    DeleteFromArray(DATA_GRIDS_FOCUSED_TREE, source.dataGridID)
    DATA_GRIDS_FOCUSED_TREE.unshift(source.dataGridID)
  }

}

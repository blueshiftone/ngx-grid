import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { DeleteFromArray } from '../../utils/array-delete'
import { DATA_GRIDS_FOCUSED_TREE } from '../grid-controller.service'
import { Operation } from '../operation.abstract'

export class SetGridFocus extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {
    if (this.gridOperations.GetIsDisabled.run()) return
    DeleteFromArray(DATA_GRIDS_FOCUSED_TREE, this.dataSource.dataGridID)
    DATA_GRIDS_FOCUSED_TREE.unshift(this.dataSource.dataGridID)
  }

}

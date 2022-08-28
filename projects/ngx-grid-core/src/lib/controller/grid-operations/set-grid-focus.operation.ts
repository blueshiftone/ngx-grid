import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { DeleteFromArray } from '../../utils/array-delete'
import { WithDefaultTrue } from '../../utils/with-default'
import { DATA_GRIDS_FOCUSED_TREE } from '../grid-controller.service'
import { Operation } from '../operation.abstract'

export class SetGridFocus extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(options: ISetGridFocusOptions = {}): void {
    if (this.gridOperations.GetIsDisabled.run() || this.gridOperations.HasGridFocus.run()) return
    DeleteFromArray(DATA_GRIDS_FOCUSED_TREE, this.dataSource.dataGridID)
    DATA_GRIDS_FOCUSED_TREE.unshift(this.dataSource.dataGridID)
    if (WithDefaultTrue(options.emitEvent)) {
      this.gridEvents.GridReceivedFocusEvent.emit(true)
    }
  }
}

export interface ISetGridFocusOptions {
  emitEvent?: boolean
}

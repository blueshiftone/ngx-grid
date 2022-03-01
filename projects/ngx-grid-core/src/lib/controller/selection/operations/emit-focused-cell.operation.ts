import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class EmitFocusedCellOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) {
    super(controller)
  }

  public run(): boolean {
    const state = this.selectionState
    if (!state.hasShiftKey && state.isAdding) {
      const nextFocusedCell = GridImplementationFactory.gridFocusedCell(state.startCellPos)
      if (state.focusedCell?.rowKey !== nextFocusedCell.rowKey || state.focusedCell?.columnKey !== nextFocusedCell.columnKey) {
        state.focusedCell = nextFocusedCell
        this.controller.gridEvents.CellFocusChangedEvent.emit(nextFocusedCell)
        return true
      }
    }
    return false
  }

}

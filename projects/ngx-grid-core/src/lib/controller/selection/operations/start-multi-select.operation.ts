import { ESelectMode } from '../../../typings/enums/select-mode.enum'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class StartMultiSelectOperation extends BaseSelectionOperation {

  constructor(controller: GridSelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    state.initialSelection.multiSelect = true
    if (state.currentSelection.includes(state.startCellPos)) {
      state.mode = ESelectMode.Subtract
    }
  }

}

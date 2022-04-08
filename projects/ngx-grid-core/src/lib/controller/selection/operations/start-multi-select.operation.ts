import { ESelectMode } from '../../../typings/enums/select-mode.enum'
import { ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class StartMultiSelect extends BaseSelectionOperation {

  constructor(controller: ISelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    if (!state) return
    state.initialSelection.multiSelect = true
    if (state.currentSelection.includes(state.startCellPos)) {
      state.mode = ESelectMode.Subtract
    }
  }

}

import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class CalculateNextSelectionOperation extends BaseSelectionOperation {

  constructor(public readonly controller: GridSelectionController) { super(controller) }

  public run(
    selection = this.selectionState.currentSelection,
    from      = this.selectionState.startCellPos,
    to        = this.selectionState.endCellPos
  ): void {
    const state = this.selectionState 

    if (state.isAdding && !state.hasModifiers) this.controller.addSelection(selection, from, to) 
    if (state.hasModifiers)                    this.controller.addSecondarySelection(selection, from, to)
    if (state.isSubtracting)                   this.controller.subtractSelection(selection, from, to)
  }

}

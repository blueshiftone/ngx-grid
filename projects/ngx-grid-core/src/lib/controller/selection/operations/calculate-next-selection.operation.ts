import { IGridCellCoordinates, IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class CalculateNextSelection extends BaseSelectionOperation {

  constructor(public readonly controller: ISelectionController) { super(controller) }

  public run(
    selection?: IGridSelectionRange,
    from?     : IGridCellCoordinates,
    to?       : IGridCellCoordinates
  ): void {
    const state = this.selectionState 
    if (!state) return

    if (state.isAdding && !state.hasModifiers) this.controller.AddSelection.run(selection ?? state.currentSelection, from ?? state.startCellPos, to ?? state.endCellPos) 
    if (state.hasModifiers)                    this.controller.AddSecondarySelection.run(selection, from, to)
    if (state.isSubtracting)                   this.controller.SubtractSelection.run(selection, from, to)
    console.log(state.currentSelection)
  }

}

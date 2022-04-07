import { IGridCellCoordinates, IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class AddSecondarySelection extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) { super(controller) }

  public run(
    selection?: IGridSelectionRange,
    from?     : IGridCellCoordinates,
    to?       : IGridCellCoordinates
  ): void {
    const state = this.selectionState
    if (!state) return
    selection = selection ?? state.currentSelection
    selection.secondarySelection = GridImplementationFactory.gridSelectionRange(this.controller.gridEvents).addRange(from ?? state.startCellPos, to ?? state.endCellPos)
    selection.secondarySelection.isSubtracting = state.isSubtracting
  }

}

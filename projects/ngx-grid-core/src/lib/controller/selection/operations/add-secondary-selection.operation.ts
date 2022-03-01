import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class AddSecondarySelectionOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) { super(controller) }

  public run(
    selection = this.selectionState.currentSelection,
    from      = this.selectionState.startCellPos,
    to        = this.selectionState.endCellPos
  ): void {
    selection.secondarySelection = GridImplementationFactory.gridSelectionRange(this.controller.gridEvents).addRange(from, to)
    selection.secondarySelection.isSubtracting = this.selectionState.isSubtracting
  }

}

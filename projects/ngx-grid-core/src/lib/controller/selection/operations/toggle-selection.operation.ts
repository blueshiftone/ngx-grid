import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ToggleSelectionOperation extends BaseSelectionOperation {

  constructor(controller: GridSelectionController) { super(controller) }

  public run(
    selection = this.selectionState.currentSelection,
    from      = this.selectionState.startCellPos,
    to        = this.selectionState.endCellPos
  ): void {
    selection.toggleRange(from, to)
  }

}

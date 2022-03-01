import { IGridSelectionRange } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class EmitNextSelectionOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) {
    super(controller)
  }

  public run(nextSelection: IGridSelectionRange | null): boolean {
    const prevSelection = this._getPreviousSelection()
    if (nextSelection && prevSelection && nextSelection.isEqual(prevSelection)) return false
    this.controller.gridEvents.CellSelectionChangedEvent.emit(nextSelection)
    return true
  }

  private _getPreviousSelection() { return this.controller.gridEvents.CellSelectionChangedEvent.state }

}

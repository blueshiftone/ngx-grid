import { ISelectionController } from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class UpdateFocusedCell extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) {
    super(controller)
  }

  public run(): void {
    if (!this.selectionState) return
    const nextSelection = this.controller.latestSelection()
    if (nextSelection && nextSelection.cellCount > 0) {
      if (this._focusedCell && !nextSelection.includes(this._focusedCell)) {
        this.selectionState.focusedCell = GridImplementationFactory.gridFocusedCell(nextSelection.getBounds().topLeft)
        this._gridEvents.CellFocusChangedEvent.emit(this.selectionState.focusedCell)
      }
    } else {
      this.selectionState.focusedCell = undefined
      this._gridEvents.CellFocusChangedEvent.emit(undefined)
    }
  }

  private get _focusedCell() {
    return this._gridEvents.CellFocusChangedEvent.state
  }

  private get _gridEvents() {
    return this.controller.gridEvents
  }

}

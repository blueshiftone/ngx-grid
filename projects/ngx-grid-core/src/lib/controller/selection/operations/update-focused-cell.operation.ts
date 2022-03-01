import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class UpdateFocusedCellOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) {
    super(controller)
  }

  public run(): void {
    const nextSelection = this.controller.latestSelection
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

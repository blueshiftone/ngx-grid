import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ClearSelectionOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) { super(controller) }

  public run(): void {
    this.controller.emitNextSelection(null)
    this.controller.emitNextSelectionSlice()
    this.controller.gridEvents.CellFocusChangedEvent.emit(undefined)
  }

}

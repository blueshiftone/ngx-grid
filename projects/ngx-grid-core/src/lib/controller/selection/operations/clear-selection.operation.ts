import { ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ClearSelection extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) { super(controller) }

  public run(): void {
    this.controller.EmitNextSelection.run(null)
    this.controller.EmitNextSelectionSlice.run()
    this.controller.gridEvents.CellFocusChangedEvent.emit(undefined)
  }

}

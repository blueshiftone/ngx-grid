import { IGridRowComponent } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ExpandToRowOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    const row   = this._getLastSeenRow()
    if (!row) throw new Error('There is no active row information to make a selection with')
    state.startCellPos = row.firstCellPosition
    state.endCellPos   = row.lastCellPosition
  }

  private _getLastSeenRow(): IGridRowComponent | undefined {
    return this.controller.gridEvents.RowMouseEnteredEvent.state
  }

}

import { IGridRowComponent, ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ExpandToRow extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    const row   = this._getLastSeenRow()
    if (!row) throw new Error('There is no active row information to make a selection with')
    if (!state) return
    state.startCellPos = row.firstCellPosition
    state.endCellPos   = row.lastCellPosition
  }

  private _getLastSeenRow(): IGridRowComponent | undefined {
    return this.controller.gridEvents.RowMouseEnteredEvent.state
  }

}

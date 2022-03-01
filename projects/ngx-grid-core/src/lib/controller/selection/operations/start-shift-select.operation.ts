import { IGridSelectionRange } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class StartShiftSelectOperation extends BaseSelectionOperation {

  constructor(controller: GridSelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    if (!this._hasShiftKey) return
    if (state.hasFocusedCell)    this._resetToFocalPoint()
    if (state.previousSelection) this._resetCurrentSelection(state.previousSelection)
  }

  private _resetToFocalPoint(): void {
    const state       = this.selectionState
    const focusedCell = state.focusedCell
    if (typeof focusedCell === 'undefined') throw new Error('Focused cell is undefined')
    state.endCellPos   = state.startCellPos
    state.startCellPos = focusedCell
  }

  private _resetCurrentSelection(previousSelection: IGridSelectionRange): void {
    this.selectionState.currentSelection = previousSelection.clone()
  }

  private get _hasShiftKey(): boolean { return this.selectionState.hasShiftKey }

}

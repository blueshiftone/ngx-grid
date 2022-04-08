import { IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class StartShiftSelect extends BaseSelectionOperation {

  constructor(controller: ISelectionController) { super(controller) }

  public run(): void {
    const state = this.selectionState
    if (!state) return
    if (!this._hasShiftKey) return
    if (state.hasFocusedCell)    this._resetToFocalPoint()
    if (state.previousSelection) this._resetCurrentSelection(state.previousSelection)
  }

  private _resetToFocalPoint(): void {
    const state       = this.selectionState
    if (!state) return
    const focusedCell = state.focusedCell
    if (typeof focusedCell === 'undefined') throw new Error('Focused cell is undefined')
    state.endCellPos   = state.startCellPos
    state.startCellPos = focusedCell
  }

  private _resetCurrentSelection(previousSelection: IGridSelectionRange): void {
    if (!this.selectionState) return
    this.selectionState.currentSelection = previousSelection.clone()
  }

  private get _hasShiftKey(): boolean { return this.selectionState?.hasShiftKey ?? false }

}

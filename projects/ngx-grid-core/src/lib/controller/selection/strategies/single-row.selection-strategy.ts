import { fromEvent } from 'rxjs'

import {
  IGridCellCoordinates,
  IGridKeyboardEvent,
  IGridSelectionRange,
  IGridSelectionStrategy,
  ISelectionController,
} from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { HasParentOfClass } from '../../../utils/find-parent-element-of-class'

export class SingleRowSelectionStrategy implements IGridSelectionStrategy {

  constructor(public readonly controller: ISelectionController) {}

  public attach(el: HTMLElement): void {

    this._keyboardHandling()

    this.controller.addSubscription(fromEvent<MouseEvent>(el, 'mousedown').subscribe(e => {
      // button 0 = Left Mouse Button
      if (e.button !== 0 || !HasParentOfClass('cell', e.target as HTMLElement)) return
      
      let state = this.controller.CreateSelectionStateFromMouseEvent.run({
        ctrlKey: false,
        shiftKey: false,
        target: e.target
      })
      if (!state) return
      
      this.controller.state = state
      
      this.controller.ExpandToRow.run()
      
      this.controller.EmitFocusedCell.run()
      
      this.controller.CalculateNextSelection.run()

      if(state.currentSelection.isEqual(this._lastSelection)) {    
        state.previousSelection = undefined
        this.controller.gridEvents.CellFocusChangedEvent.emit(undefined)
        this._emitSelection(null)
        return
      }
      
      this._emitSelection(state.currentSelection)

    }))
    
  }

  private _keyboardHandling(): void {

    const move = (increment: number) => {
      const state = this.controller.state
      if (!state) throw new Error('State is undefined')
      const utils = state.currentSelection.globalUtils
      let rowKey = this._lastPreSelection ?? Array.from(this._lastSelection?.rows || [])[0]
      if (rowKey !== null && rowKey !== undefined) rowKey = utils.incrementRow(rowKey, increment)
      else rowKey = 0
      this.controller.gridEvents.RowPreselectedEvent.emit(rowKey)
      this.controller.ScrollIntoView.run(new GridCellCoordinates(rowKey, utils.getFirstColumn()))
    }

    this.controller.keyboardEvents.arrowDown  =
    this.controller.keyboardEvents.arrowRight = () => move(1)

    this.controller.keyboardEvents.arrowUp    =
    this.controller.keyboardEvents.arrowLeft  = () => move(-1)

    this.controller.keyboardEvents.tab = (e: IGridKeyboardEvent) => {
      if (e.hasShiftKey) move(-1)
      else               move(1)
    }

    this.controller.keyboardEvents.enter = 
    this.controller.keyboardEvents.space = () => {
      if (!this.controller.state) return
      const state = this.controller.state
      const utils = state.currentSelection.globalUtils
      const rowKey = this._lastPreSelection
      if (rowKey !== null) {
        const coords: [IGridCellCoordinates, IGridCellCoordinates] = [
          new GridCellCoordinates(rowKey, utils.getFirstColumn()),
          new GridCellCoordinates(rowKey, utils.getLastColumn())]
        if (this._lastSelection?.includesRow(rowKey)) {
          const nextSelection = this.controller.state.currentSelection.clone()
          nextSelection.removeRange(...coords)
          this._emitSelection(null)
          this.controller.state.currentSelection = nextSelection       
          this.controller.UpdateFocusedCell.run()
        } else {
          this.controller.ReplaceSelection.run(coords)
          this.controller.EmitNextSelectionSlice.run()
        }
      }      
    }

  }

  private _emitSelection = (s: IGridSelectionRange | null) => {
    this.controller.EmitNextSelection.run(s)
    this.controller.EmitNextSelectionSlice.run()
  }

  private get _lastSelection()    { return this.controller.gridEvents.CellSelectionChangedEvent.state ?? null }
  private get _lastPreSelection() { return this.controller.gridEvents.RowPreselectedEvent.state ?? null }

}

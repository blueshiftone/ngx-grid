import { fromEvent, merge, Subject } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'

import {
  IGridCellCoordinates,
  IGridKeyboardEvent,
  IGridSelectionRange,
  IGridSelectionStrategy,
  ISelectionController,
} from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { removeNullish } from '../../../utils/custom-rxjs/remove-nullish'
import { HasParentOfClass } from '../../../utils/find-parent-element-of-class'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'

export class MultiRowSelectionStrategy implements IGridSelectionStrategy {

  constructor(public readonly controller: ISelectionController) { }

  public attach(el: HTMLElement): void {
    this._keyboardHandling()
    this.controller.addSubscription(fromEvent(window.document.documentElement, 'mouseup').subscribe(_ => this._mouseReleased.next(true)))
    this.controller.addSubscription(fromEvent<MouseEvent>(el, 'mousedown').subscribe(e => this._startSelection(e)))
  }

  private _startSelection(e: MouseEvent): void {
    // button 0 = Left Mouse Button
    if (e.button !== 0 || !HasParentOfClass('cell', e.target as HTMLElement)) return
    this._gridEvents.CellSelectionStartedEvent.emit(true)

    let state = this.controller.CreateSelectionStateFromMouseEvent.run({
      ctrlKey: !e.shiftKey && typeof this.controller.state?.previousSelection !== 'undefined',
      shiftKey: e.shiftKey,
      target: e.target
    })

    if (!state) return
    
    e.preventDefault() // stops native html element dragging 

    this.controller.state = state

    this.controller.ExpandToRow.run()

    if (state.hasCtrlKey) this.controller.StartMultiSelect.run()
    else if (state.hasShiftKey) this.controller.StartShiftSelect.run()

    this.controller.CalculateNextSelection.run()

    const focusChanged = this.controller.EmitFocusedCell.run()
    if (focusChanged) state.previousSelection = state.currentSelection.clone()

    this._continueSelection()
  }

  private _continueSelection(): void {

    const state = this.controller.state
    if (!state) throw new Error('Selection state is undefined')

    this._gridEvents.RowMouseEnteredEvent.on()
      .pipe(removeNullish(), takeUntil(merge(this._windowFocusChanged, this._mouseReleased)))
      .subscribe(rowComponent => {
        const nextSelection = (state.hasShiftKey && state.previousSelection ? state.previousSelection : state.initialSelection).clone()
        this.controller.CalculateNextSelection.run(nextSelection, state.startCellPos, rowComponent.lastCellPosition)
        this._emitSelection(nextSelection)
      })
      .add(() => {
        const finalSelection = this.controller.GetFinalSelection.run()
        this._gridEvents.CellSelectionStoppedEvent.emit(true)
        this._emitSelection(finalSelection)
        this.controller.EmitNextSelectionSlice.run()
        this.controller.UpdateFocusedCell.run()
      })

  }  

  private _keyboardHandling(): void {

    const move = (increment: number) => {
      const state = this.controller.state
      if (!state) throw new Error('State is undefined')
      const utils = state.currentSelection.globalUtils
      let rowKey = this._lastPreSelection ?? Array.from(this.controller.latestSelection()?.rows || [])[0]
      if (rowKey !== null && rowKey !== undefined) rowKey = utils.incrementRow(rowKey, increment)
      else rowKey = 0
      this._gridEvents.RowPreselectedEvent.emit(rowKey)
      this.controller.ScrollIntoView.run(new GridCellCoordinates(rowKey, utils.getFirstColumn().columnKey))
    }

    this.controller.keyboardEvents.ctrlA = () => this.controller.SelectAll.run()

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
      const rowKey = this._lastPreSelection
      const utils  = this.controller.state.currentSelection.globalUtils
      if (rowKey !== null) {
        
        const coords: [IGridCellCoordinates, IGridCellCoordinates] = [
          new GridCellCoordinates(rowKey, utils.getFirstColumn().columnKey),
          new GridCellCoordinates(rowKey, utils.getLastColumn().columnKey)]

        let nextState = new GridSelectionStateFromCoordinates(...coords, this.controller.gridController, {
          initialSelection : this._getSelection(),
          focusedCell      : this._getFocusedCell(),
          previousSelection: this.controller.state.previousSelection
        })
        
        if (this.controller.latestSelection()?.includesRow(rowKey)) nextState.currentSelection.removeRange(...coords)
        else nextState.currentSelection.addRange(...coords)

        if (!nextState.currentSelection.cellCount && !nextState.currentSelection.secondarySelection?.cellCount) this._emitSelection(null)
        else this._emitSelection(nextState.currentSelection)
        
        this.controller.state = nextState
        this.controller.UpdateFocusedCell.run()
        this.controller.EmitNextSelectionSlice.run()
      }
    }

  }

  private _emitSelection = (s: IGridSelectionRange | null) => {
    this.controller.EmitNextSelection.run(s)
  }

  private get _lastPreSelection() {
    return this._gridEvents.RowPreselectedEvent.state ?? null
  }

  private _mouseReleased = new Subject<boolean>()
  private _windowFocusChanged = merge(fromEvent(window, 'focus'), fromEvent(window, 'blur')).pipe(
    map(_ => window.document.hasFocus()),
    distinctUntilChanged()
  )

  private _getSelection(): IGridSelectionRange        {
    return this._getPreviousSelection() ?? GridImplementationFactory.gridSelectionRange(this.controller.gridController)
  }
  
  private _getFocusedCell() { 
    return this._gridEvents.CellFocusChangedEvent.state
  }

  private _getPreviousSelection() {
    return this._gridEvents.CellSelectionChangedEvent.state
  }

  private get _gridEvents() {
    return this.controller.gridEvents
  }

}

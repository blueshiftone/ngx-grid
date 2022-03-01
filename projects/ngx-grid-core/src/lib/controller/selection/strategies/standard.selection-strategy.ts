import { fromEvent, merge, Observable, Subject } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'

import {
  IGridCellCoordinates,
  IGridKeyboardEvent,
  IGridSelectionRange,
  IGridSelectionStrategy,
  IMoveSelectionFromFocusConfigs,
} from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { removeNullish } from '../../../utils/custom-rxjs/remove-nullish'
import { HasParentOfClass } from '../../../utils/find-parent-element-of-class'
import { GridSelectionController } from '../grid-selection.controller'

export class StandardSelectionStrategy implements IGridSelectionStrategy {

  constructor(public readonly controller: GridSelectionController) { }

  public attach(el: HTMLElement): void {

    this.controller.addSubscription(fromEvent(window.document.documentElement, 'mouseup').subscribe(_ => this._mouseReleased.next(true)))
    this.controller.addSubscription(fromEvent<MouseEvent>(el, 'mousedown').subscribe(e => this._startSelection(e)))
    this._keyboardHandling()
  }

  private _startSelection(e: MouseEvent): void {
    if (!HasParentOfClass('cell', e.target as HTMLElement)) return
    let state = this.controller.createStateFromMouseEvent(e)
    if (!state) return
    
    const lastSelection = this.controller.latestSelection
    // button 2 = Right Mouse Button
    if (e.button === 2 && lastSelection?.includes(state.startCellPos) === true) return
    
    this._gridEvents.CellSelectionStartedEvent.emit(true)
    
    // button 0 = Left Mouse Button
    if (e.button === 0) e.preventDefault() // stops native html element dragging 

    this.controller.state = state

    if (state.isRowSelection) this.controller.expandToRow()

    if (state.hasCtrlKey) this.controller.startMultiSelect()
    else if (state.hasShiftKey) this.controller.startShiftSelect()

    this.controller.calculateNextSelection()

    const focusChanged = this.controller.emitFocusedCell()
    if (focusChanged) {
      state.previousSelection = state.currentSelection.clone()
    }

    this._continueSelection()
  }

  private _continueSelection(): void {

    const state = this.controller.state
    if (!state) throw new Error('Selection state is undefined')

    const event: Observable<IGridCellCoordinates> = state.isRowSelection ?
      this._gridEvents.RowMouseEnteredEvent.onWithInitialValue().pipe(removeNullish(), map(row => row.lastCellPosition)) :
      this._gridEvents.CellMouseEnteredEvent.onWithInitialValue().pipe(removeNullish(), map(cell => new GridCellCoordinates( cell.rowComponent.rowKey, cell.columnKey )))

    event
      .pipe(takeUntil(merge(this._windowFocusChanged, this._mouseReleased)))
      .subscribe(endCellPos => {
        const nextSelection = (state.hasShiftKey && state.previousSelection ? state.previousSelection : state.initialSelection).clone()
        this.controller.calculateNextSelection(nextSelection, state.startCellPos, endCellPos)
        this._emitSelection(nextSelection)
        this.controller.emitNextSelectionSlice()
      })
      .add(() => {
        const finalSelection = this.controller.getFinalSelection()
        this._gridEvents.CellSelectionStoppedEvent.emit(true)
        this._emitSelection(finalSelection)
        this.controller.emitNextSelectionSlice()
        this.controller.updateFocusedCell()
      })

  }

  private _keyboardHandling(): void {

    const configs = (e: IGridKeyboardEvent): IMoveSelectionFromFocusConfigs => {
      return {
        hasModifier: e.hasShiftKey || e.hasCtrlKey
      }
    }

    const move = (e: IGridKeyboardEvent) => this.controller.moveSelectionFromFocus(configs(e))

    this.controller.keyboardEvents.arrowDown  = (e: IGridKeyboardEvent) => move(e).toCellBelow()
    this.controller.keyboardEvents.arrowUp    = (e: IGridKeyboardEvent) => move(e).toCellAbove()
    this.controller.keyboardEvents.arrowLeft  = (e: IGridKeyboardEvent) => move(e).toCellLeft()
    this.controller.keyboardEvents.arrowRight = (e: IGridKeyboardEvent) => move(e).toCellRight()
    
    this.controller.keyboardEvents.ctrlA      = () => this.controller.selectAll()

    this.controller.keyboardEvents.home = (e: IGridKeyboardEvent) => {
      if (e.hasCtrlKey) this.controller.moveSelectionFromFocus({ hasModifier: e.hasShiftKey }).toStartOfGrid()
      else move(e).toStartOfRow()
    }

    this.controller.keyboardEvents.end = (e: IGridKeyboardEvent) => {
      if (e.hasCtrlKey) this.controller.moveSelectionFromFocus({ hasModifier: e.hasShiftKey }).toEndOfGrid()
      else move(e).toEndOfRow()
    }

    this.controller.keyboardEvents.tab = (e: IGridKeyboardEvent) => {
      if (e.hasShiftKey) this.controller.moveSelectionFromFocus({ hasModifier: e.hasCtrlKey }).toCellLeft()
      else move(e).toCellRight()
    }

    this.controller.keyboardEvents.pageUp   = (e: IGridKeyboardEvent) => move(e).toPageUp()
    this.controller.keyboardEvents.pageDown = (e: IGridKeyboardEvent) => move(e).toPageDown()

    this.controller.keyboardEvents.any = () => this.controller.emitNextSelectionSlice()

  }

  private _emitSelection = (s: IGridSelectionRange) => this.controller.emitNextSelection(s)

  private _mouseReleased = new Subject<boolean>()
  private _windowFocusChanged = merge(fromEvent(window, 'focus'), fromEvent(window, 'blur')).pipe(
    map(_ => window.document.hasFocus()),
    distinctUntilChanged()
  )

  private get _gridEvents() {
    return this.controller.gridEvents
  }

}

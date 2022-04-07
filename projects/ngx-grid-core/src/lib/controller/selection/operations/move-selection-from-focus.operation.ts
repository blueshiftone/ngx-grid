import { IGridCellCoordinates, IMoveSelectionFromFocusConfigs, ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey, TPrimaryKey } from '../../../typings/types'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class MoveSelectionFromFocus extends BaseSelectionOperation {

  private _hasModifiers: boolean = false
  private _isRowMode = false

  constructor(public readonly controller: ISelectionController) { super(controller) }

  public run(configs: IMoveSelectionFromFocusConfigs) {
    this._hasModifiers = configs.hasModifier || false
    return {
      toRowBelow   : () => { this._applyNext(this._nextRow(1)) },
      toRowAbove   : () => { this._applyNext(this._nextRow(-1)) },
      toCellBelow  : () => { this._applyNext(this._nextCell(0, 1)) },
      toCellAbove  : () => { this._applyNext(this._nextCell(0, -1)) },
      toCellRight  : () => { this._applyNext(this._nextCell(1, 0)) },
      toCellLeft   : () => { this._applyNext(this._nextCell(-1, 0)) },
      toEndOfRow   : () => { this._applyNext(this._nextCell(this.controller.GetLastColumnIndex.run(), 0)) },
      toStartOfRow : () => { this._applyNext(this._nextCell(this.controller.GetLastColumnIndex.run() * -1, 0)) },
      toEndOfGrid  : () => { this._applyNext(this._nextCell(this.controller.GetLastColumnIndex.run(), this.controller.GetLastRowIndex.run())) },
      toStartOfGrid: () => { this._applyNext(this._nextCell(this.controller.GetLastColumnIndex.run() * -1, this.controller.GetLastRowIndex.run() * -1)) },
      toPageUp     : () => { this._applyNext(this._nextCell(0, this.controller.pageSize() * -1)) },
      toPageDown   : () => { this._applyNext(this._nextCell(0, this.controller.pageSize())) },
    }
  }

  private _applyNext(coordinates: [IGridCellCoordinates, IGridCellCoordinates] | null): void {
    if (!coordinates) {
      console.warn('Null next selection')
      return
    }

    let   state = this.selectionState

    if (!this._hasModifiers) {

      state = new GridSelectionStateFromCoordinates( ...coordinates, this.controller.gridEvents, {
        focusedCell: this._focusedCell,
        previousSelection: this.selectionState?.previousSelection?.clone()
      }, this._hasModifiers, this._hasModifiers)
      this.controller.state = state

      this.controller.CalculateNextSelection.run()

      const focusChanged = this.controller.EmitFocusedCell.run()
      if (focusChanged) state.previousSelection = state.currentSelection.clone()

      this.controller.EmitNextSelection.run(state.currentSelection)

    } else {

      if (!state) return

      const prevSelection = state.previousSelection
      if (!prevSelection) return

      prevSelection.secondarySelection = GridImplementationFactory.gridSelectionRange(this.controller.gridEvents).addRange(...coordinates)

      const finalSelection = state.currentSelection.clone()

      for (const rowKey of prevSelection.secondarySelection.rows) {
        for (const columnKey of prevSelection.secondarySelection.colsAt(rowKey)) {
          finalSelection.add(new GridCellCoordinates(rowKey, columnKey))
        }
      }

      finalSelection.secondarySelection = null

      this.controller.EmitNextSelection.run(finalSelection)

    }    

    this.controller.ScrollIntoView.run(this._isRowMode ? coordinates[0] : coordinates[1])
  }

  private _nextRow(increment: number): [IGridCellCoordinates, IGridCellCoordinates] | null {
    const nextCell = this._nextCell(0, increment)
    if (!nextCell) return null
    nextCell[0].rowKey = 0
    nextCell[1].rowKey = this.controller.GetLastColumnIndex.run()
    this._isRowMode = true
    return nextCell
  }

  private _nextCell(incrementX: number, incrementY: number): [IGridCellCoordinates, IGridCellCoordinates] | null {
    this._isRowMode = false    
    const state = this.selectionState
    if (!state) return null
    const utils   = state.currentSelection.globalUtils
    const focused = state.focusedCell
    if (!focused) return null
    let newColumnKey    : TColumnKey  = ''
    let newRowKey: TPrimaryKey = 0
    if (this._hasModifiers) {
      const selection = state.previousSelection?.secondarySelection || state.previousSelection
      if (!selection) return null
      const bounds = Object.values(selection.getBounds())
      let success = false
      for (const bound of bounds) {
        if (focused.isCell(bound)) {
          const cell = bound.opposite
          newColumnKey = utils.incrementColumn(cell.columnKey, incrementX)
          newRowKey    = utils.incrementRow(cell.rowKey, incrementY)
          success      = true
          break
        }
      }
      if (!success) {
        console.error(`Unable to match focused cell to bounding cells`)
        return null
      }
      return [focused, new GridCellCoordinates(newRowKey, newColumnKey)]
    } else {
      newColumnKey = utils.incrementColumn(focused.columnKey, incrementX)
      newRowKey    = utils.incrementRow(focused.rowKey, incrementY)
    }
    return [new GridCellCoordinates(newRowKey, newColumnKey), new GridCellCoordinates(newRowKey, newColumnKey)]
  }

  private get _focusedCell() {
    return this.controller.gridEvents.CellFocusChangedEvent.state
  }

}


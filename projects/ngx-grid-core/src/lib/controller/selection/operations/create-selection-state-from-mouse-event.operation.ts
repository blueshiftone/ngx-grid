import { IGridCellComponent, IGridCellFocused, IGridSelectionRange, IGridSelectionState, ISelectionController } from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TAtLeast } from '../../../typings/types/at-least.type'
import { GridSelectionStateFromEvent } from '../state-generators/grid-selection-state-from-event.class'

export class CreateSelectionStateFromMouseEvent {

  constructor(private readonly controller: ISelectionController) {}

  public run(e: TAtLeast<MouseEvent, 'ctrlKey' | 'shiftKey' | 'target'>): IGridSelectionState | false {

    const activeCell = this._getActiveCell()

    if (!activeCell || this._cellIsBeingEdited(activeCell)) return false

    const state = new GridSelectionStateFromEvent(e, {
      initialSelection : (e.ctrlKey || e.shiftKey || e.metaKey) ? this._getSelection(): this._newSelection(),
      focusedCell      : this._getFocusedCell(),
      previousSelection: this.controller.state?.previousSelection
    }, activeCell)

    return state
  }

  private _cellIsBeingEdited(cell: IGridCellComponent): boolean {
    const editingCell = this._getEditingCell()    
    return editingCell?.rowComponent.rowKey === cell.rowKey && editingCell.column.columnKey === cell.column.columnKey
  }

  private _getActiveCell() : IGridCellComponent | undefined { return this._gridEvents.CellMouseEnteredEvent.state }
  
  private _getSelection()  : IGridSelectionRange            { return this._gridEvents.CellSelectionChangedEvent.state || this._newSelection() }
  private _getEditingCell(): IGridCellComponent | undefined { return this._gridEvents.EditingCellChangedEvent.state ?? undefined }
  private _getFocusedCell(): IGridCellFocused | undefined   { return this._gridEvents.CellFocusChangedEvent.state }
  private _newSelection()  : IGridSelectionRange            { return GridImplementationFactory.gridSelectionRange(this.controller.gridController) }

  private get _gridEvents() { return this.controller.gridEvents } 

}

import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../../typings/types'
import { GridSelectionController } from '../grid-selection.controller'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'

export class PreselectRowsOperation {

  constructor(private readonly controller: GridSelectionController) {}

  public run(rowKeys: Array<TPrimaryKey>) {

    const columns = this._getColumns()
    if (!columns || !columns.visibleColumns.length) return null
    const visibleColumns = columns.visibleColumns
    const firstCol       = visibleColumns[0]
    const lastCol        = visibleColumns[visibleColumns.length - 1]

    const startPos = new GridCellCoordinates(rowKeys[0], firstCol)
    const endPos   = new GridCellCoordinates(rowKeys[0], lastCol)

    const state = new GridSelectionStateFromCoordinates(startPos, endPos, this.controller.gridEvents)

    this.controller.state = state

    rowKeys.forEach(rowKey => {
      state.currentSelection.addRange(
        new GridCellCoordinates(rowKey, firstCol),
        new GridCellCoordinates(rowKey, lastCol))
    })

    const focusChanged = this.controller.emitFocusedCell()
    if (focusChanged) state.previousSelection = state.currentSelection.clone()

    this.controller.emitNextSelection(state.currentSelection)

    return state

  }

  private _getColumns() {
    return this.controller.gridEvents.ColumnsUpdatedEvent.state
  }

}

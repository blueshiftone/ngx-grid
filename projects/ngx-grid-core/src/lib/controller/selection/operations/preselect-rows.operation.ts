import { ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../../typings/types'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'

export class PreselectRows {

  constructor(private readonly controller: ISelectionController) {}

  public run(rowKeys: Array<TPrimaryKey>) {

    const columns = this._getColumns()
    if (!columns || !columns.length) return null
    const firstCol       = columns[0]
    const lastCol        = columns[columns.length - 1]

    const startPos = new GridCellCoordinates(rowKeys[0], firstCol.columnKey)
    const endPos   = new GridCellCoordinates(rowKeys[0], lastCol.columnKey)

    const state = new GridSelectionStateFromCoordinates(startPos, endPos, this.controller.gridEvents)

    this.controller.state = state

    rowKeys.forEach(rowKey => {
      state.currentSelection.addRange(
        new GridCellCoordinates(rowKey, firstCol.columnKey),
        new GridCellCoordinates(rowKey, lastCol.columnKey))
    })

    const focusChanged = this.controller.EmitFocusedCell.run()
    if (focusChanged) state.previousSelection = state.currentSelection.clone()

    this.controller.EmitNextSelection.run(state.currentSelection)

    return state

  }

  private _getColumns() {
    return this.controller.gridController.dataSource.columns
  }

}

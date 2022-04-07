import { IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class GetFinalSelection extends BaseSelectionOperation {

  constructor(public readonly controller: ISelectionController) { super(controller) }

  public run(): IGridSelectionRange {
    const state = this.selectionState
    const finalSelection = this._selection.clone()
    if (!state) return finalSelection
    if (state.hasModifiers && finalSelection.secondarySelection && state.isAdding) {
      for (const rowKey of finalSelection.secondarySelection.rows) {
        for (const columnKey of finalSelection.secondarySelection.colsAt(rowKey)) {
          finalSelection.add(new GridCellCoordinates(rowKey, columnKey))
        }
      }
    }
    finalSelection.secondarySelection = null
    return finalSelection
  }

  private get _selection()  : IGridSelectionRange { return this.controller.gridEvents.CellSelectionChangedEvent.state ?? this._newSelection() }
  private _newSelection()   : IGridSelectionRange { return GridImplementationFactory.gridSelectionRange(this.controller.gridEvents) }

}

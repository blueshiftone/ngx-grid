import { IGridCellCoordinates, IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class SubtractSelection extends BaseSelectionOperation {

  constructor(controller: ISelectionController) { super(controller) }

  public run(
    selection?: IGridSelectionRange,
    from?     : IGridCellCoordinates,
    to?       : IGridCellCoordinates
  ) {
    if (!this.selectionState) return
    (selection ?? this.selectionState.currentSelection).removeRange(from ?? this.selectionState.startCellPos, to ?? this.selectionState.endCellPos)
  }

}

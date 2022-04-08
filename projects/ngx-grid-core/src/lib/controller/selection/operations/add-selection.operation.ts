import { IGridCellCoordinates, IGridSelectionRange, ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class AddSelection extends BaseSelectionOperation {

  constructor(controller: ISelectionController) { super(controller) }

  public run(
    selection?: IGridSelectionRange,
    from?     : IGridCellCoordinates,
    to?       : IGridCellCoordinates
  ): void {
    if (!this.selectionState) return
    (selection ?? this.selectionState.currentSelection).addRange(from ?? this.selectionState.startCellPos, to ?? this.selectionState.endCellPos)
  }

}

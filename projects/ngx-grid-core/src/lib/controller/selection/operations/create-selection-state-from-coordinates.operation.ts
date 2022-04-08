import { IGridCellCoordinates, IGridSelectionState, ISelectionController } from '../../../typings/interfaces'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'

export class CreateSelectionStateFromCoordinates {

  constructor(private readonly controller: ISelectionController) { }

  public run(
    coordinates: [IGridCellCoordinates, IGridCellCoordinates],
    input?: Partial<IGridSelectionState>,
    ctrlKey?: boolean,
    shiftKey?: boolean,
  ): IGridSelectionState {
    const state = new GridSelectionStateFromCoordinates(...coordinates, this.controller.gridEvents, input, ctrlKey, shiftKey)
    return state
  }

}

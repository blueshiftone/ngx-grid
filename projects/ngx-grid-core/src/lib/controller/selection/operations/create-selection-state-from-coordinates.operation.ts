import { IGridCellCoordinates, IGridSelectionState } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'
import { GridSelectionStateFromCoordinates } from '../state-generators/grid-selection-state-from-coordinates.class'

export class CreateSelectionStateFromCoordinatesOperation {

  constructor(private readonly controller: GridSelectionController) { }

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

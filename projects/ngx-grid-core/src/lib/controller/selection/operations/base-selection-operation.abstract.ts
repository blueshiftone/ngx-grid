import { IGridSelectionState } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'

export abstract class BaseSelectionOperation {
  public selectionState: IGridSelectionState
  constructor(controller: GridSelectionController) {
    const state = controller.state
    if (!state) throw Error('State is not defined')
    this.selectionState = state
  }
}

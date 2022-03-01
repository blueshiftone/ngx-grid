import { IGridCellCoordinates } from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ReplaceSelectionOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) { super(controller) }

  public run(coordinates: [IGridCellCoordinates, IGridCellCoordinates]): void {

    const [start] = coordinates
    
    const nextFocusedCell = GridImplementationFactory.gridFocusedCell(start)

    const state = this.selectionState = this.controller.state = this.controller.createStateFromCoordinates(coordinates, {focusedCell: nextFocusedCell})

    this.controller.gridEvents.CellFocusChangedEvent.emit(nextFocusedCell)
    
    state.currentSelection.addRange(...coordinates)

    this.controller.emitNextSelection(state.currentSelection)

    this.controller.scrollIntoView(start)

  }

}

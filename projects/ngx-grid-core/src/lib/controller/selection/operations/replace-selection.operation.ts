import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class ReplaceSelection extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) { super(controller) }

  public run(coordinates: [IGridCellCoordinates, IGridCellCoordinates]): void {

    const [start] = coordinates
    
    const nextFocusedCell = GridImplementationFactory.gridFocusedCell(start)

    const state = this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run(coordinates, {focusedCell: nextFocusedCell})

    this.controller.gridEvents.CellFocusChangedEvent.emit(nextFocusedCell)
    
    state.currentSelection.addRange(...coordinates)

    this.controller.EmitNextSelection.run(state.currentSelection)

    this.controller.ScrollIntoView.run(start)

  }

}

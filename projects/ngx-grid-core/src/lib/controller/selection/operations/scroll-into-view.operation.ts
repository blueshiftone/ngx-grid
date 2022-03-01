import { IGridCellCoordinates } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'

export class ScrollIntoViewOperation {
  
  constructor(public readonly controller: GridSelectionController) { }

  public run(pos?: IGridCellCoordinates): void {
    const firstCell = this.controller.latestSelection?.coordinatesAt.topLeft()
    const coords = pos ?? firstCell
    if (!coords) return
    this.controller.gridEvents.GridScrollToChangedEvent.emit(coords)
  }

}

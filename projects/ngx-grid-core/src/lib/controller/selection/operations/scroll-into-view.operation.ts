import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'

export class ScrollIntoView {
  
  constructor(public readonly controller: ISelectionController) { }

  public run(pos?: IGridCellCoordinates): void {
    const firstCell = this.controller.latestSelection()?.coordinatesAt.topLeft()
    const coords = pos ?? firstCell
    if (!coords) return
    this.controller.gridEvents.GridScrollToChangedEvent.emit(coords)
  }

}

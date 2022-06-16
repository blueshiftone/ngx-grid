import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations/grid-cell-coordinates.implementation'

export class SelectCell {

  constructor(public readonly controller: ISelectionController) {}

  public run(coords: IGridCellCoordinates) {

    const coordinateSet: [IGridCellCoordinates, IGridCellCoordinates] = [
      new GridCellCoordinates(coords.rowKey, coords.columnKey),
      new GridCellCoordinates(coords.rowKey, coords.columnKey)
    ]

    if (this.controller.state === null) this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run(coordinateSet)

    this.controller.ReplaceSelection.run(coordinateSet)

  }

}

import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'

export class SelectCell {

  constructor(public readonly controller: ISelectionController) {}

  public run(coords: IGridCellCoordinates) {

    const coordinateSet: [IGridCellCoordinates, IGridCellCoordinates] = [{...coords}, {...coords}]

    if (this.controller.state === null) this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run(coordinateSet)

    this.controller.ReplaceSelection.run(coordinateSet)

  }

}

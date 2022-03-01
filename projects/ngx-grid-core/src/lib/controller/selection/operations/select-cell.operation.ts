import { IGridCellCoordinates } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'

export class SelectCellOperation {

  constructor(public readonly controller: GridSelectionController) {}

  public run(coords: IGridCellCoordinates) {

    const coordinateSet: [IGridCellCoordinates, IGridCellCoordinates] = [{...coords}, {...coords}]

    if (this.controller.state === null) this.controller.state = this.controller.createStateFromCoordinates(coordinateSet)

    this.controller.replaceSelection(coordinateSet)

  }

}

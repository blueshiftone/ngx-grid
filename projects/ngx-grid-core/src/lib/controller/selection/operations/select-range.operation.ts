import { IGridCellCoordinates } from '../../../typings/interfaces'
import { GridSelectionController } from '../grid-selection.controller'

export class SelectRangeOperation {

  constructor(public readonly controller: GridSelectionController) {}

  public run(start: IGridCellCoordinates, end: IGridCellCoordinates) {

    const coords = [start, end] as const
    if (this.controller.state === null) this.controller.state = this.controller.createStateFromCoordinates([...coords])
    this.controller.replaceSelection([...coords])

  }

}

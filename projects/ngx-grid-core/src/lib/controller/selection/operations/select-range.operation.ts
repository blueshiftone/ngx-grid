import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'

export class SelectRange {

  constructor(public readonly controller: ISelectionController) {}

  public run(start: IGridCellCoordinates, end: IGridCellCoordinates) {

    const coords = [start, end] as const
    if (this.controller.state === null) this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run([...coords])
    this.controller.ReplaceSelection.run([...coords])

  }

}

import { ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../../typings/types'

export class SelectRow {

  constructor(public readonly controller: ISelectionController) {}

  public run(rowKey: TPrimaryKey) {

    const utils = GridImplementationFactory.gridSelectionRange(this.controller.gridEvents).globalUtils
    
    const startPos = new GridCellCoordinates(rowKey, utils.getFirstColumn())
    const endPos   = new GridCellCoordinates(rowKey, utils.getLastColumn())
    
    if (this.controller.state === null) this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run([startPos, endPos])

    this.controller.ReplaceSelection.run([startPos, endPos])

  }

}

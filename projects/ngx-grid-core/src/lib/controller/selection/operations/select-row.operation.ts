import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../../typings/types'
import { GridSelectionController } from '../grid-selection.controller'

export class SelectRowOperation {

  constructor(public readonly controller: GridSelectionController) {}

  public run(rowKey: TPrimaryKey) {

    const utils = GridImplementationFactory.gridSelectionRange(this.controller.gridEvents).globalUtils
    
    const startPos = new GridCellCoordinates(rowKey, utils.getFirstColumn())
    const endPos   = new GridCellCoordinates(rowKey, utils.getLastColumn())
    
    if (this.controller.state === null) this.controller.state = this.controller.createStateFromCoordinates([startPos, endPos])

    this.controller.replaceSelection([startPos, endPos])

  }

}

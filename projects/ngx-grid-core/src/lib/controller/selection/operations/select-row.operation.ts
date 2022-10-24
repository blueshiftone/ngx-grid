import { ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../../typings/types'

export class SelectRow {

  constructor(public readonly controller: ISelectionController) {}

  public run(rowKey: TPrimaryKey) {

    const utils = GridImplementationFactory.gridSelectionRange(this.controller.gridController).globalUtils
    
    const startPos = new GridCellCoordinates(rowKey, utils.getFirstColumn().columnKey)
    const endPos   = new GridCellCoordinates(rowKey, utils.getLastColumn().columnKey)
    
    if (this.controller.state === null) this.controller.state = this.controller.CreateSelectionStateFromCoordinates.run([startPos, endPos])  

    this.controller.ReplaceSelection.run([startPos, endPos])

  }

}

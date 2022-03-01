import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class SelectAllOperation extends BaseSelectionOperation {

  constructor(public readonly controller: GridSelectionController) { super(controller) }

  public run() {

    const utils = this.selectionState.currentSelection.globalUtils

    const startPos = new GridCellCoordinates(utils.getFirstRow(), utils.getFirstColumn())
    const endPos   = new GridCellCoordinates(utils.getLastRow(), utils.getLastColumn())

    this.controller.replaceSelection([startPos, endPos])

  }

}

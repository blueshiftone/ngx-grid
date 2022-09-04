import { ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class SelectAll extends BaseSelectionOperation {

  constructor(public readonly controller: ISelectionController) { super(controller) }

  public run() {

    if (!this.selectionState) return

    const utils = this.selectionState.currentSelection.globalUtils

    const startPos = new GridCellCoordinates(utils.getFirstRow(), utils.getFirstColumn().columnKey)
    const endPos   = new GridCellCoordinates(utils.getLastRow(), utils.getLastColumn().columnKey)

    this.controller.ReplaceSelection.run([startPos, endPos])

  }

}

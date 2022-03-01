import { TPrimaryKey } from '../../../typings/types'
import { GridSelectionController } from '../grid-selection.controller'

export class RemoveOrphanedRowsOperation {

  constructor(public readonly controller: GridSelectionController) {}

  public run(): void {
    
    const orphanedRowKeys = new Set<TPrimaryKey>()
    
    let lastSelection = this.controller.latestSelection
    if (!lastSelection) return

    const rowKeys       = lastSelection.rowKeys
    const nextSelection = lastSelection.clone()

    for (const key of rowKeys) {
      if (typeof this.controller.gridController.row.GetRow.run(key) === 'undefined') {
        orphanedRowKeys.add(key)
      }
    }

    if (orphanedRowKeys.size) {

      for (const cell of nextSelection.allCellCoordinates()) {
        if (orphanedRowKeys.has(cell.rowKey)) nextSelection.remove(cell)
      }

      this.controller.emitNextSelection(nextSelection.cellCount > 0 ? nextSelection : null)
      this.controller.emitNextSelectionSlice()

    }

  }

}

import { ISelectionController } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'

export class RemoveOrphanedRows {

  constructor(public readonly controller: ISelectionController) {}

  public run(): void {
    
    const orphanedRowKeys = new Set<TPrimaryKey>()
    
    let lastSelection = this.controller.latestSelection()
    if (!lastSelection) return

    const rowKeys       = lastSelection.rowKeys
    const nextSelection = lastSelection.clone()

    for (const key of rowKeys) {
      if (this.controller.gridController.row.GetRow.run(key) === undefined) {
        orphanedRowKeys.add(key)
      }
    }

    if (orphanedRowKeys.size) {

      for (const cell of nextSelection.allCellCoordinates()) {
        if (orphanedRowKeys.has(cell.rowKey)) nextSelection.remove(cell)
      }

      this.controller.EmitNextSelection.run(nextSelection.cellCount > 0 ? nextSelection : null)
      this.controller.EmitNextSelectionSlice.run()

    }

  }

}

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
      if (!this.controller.gridController.dataSource.rowExists(key)) {
        orphanedRowKeys.add(key)
      }
    }

    if (orphanedRowKeys.size) {

      for (const cell of nextSelection.allCellCoordinates()) {
        if (orphanedRowKeys.has(cell.rowKey)) nextSelection.remove(cell)
      }

      const focusedRowKey = this.controller.gridEvents.CellFocusChangedEvent.state?.rowKey?.toString() ?? null
      if (nextSelection.cellCount == 0 || focusedRowKey && orphanedRowKeys.has(focusedRowKey)) {
        this.controller.gridEvents.CellFocusChangedEvent.emit(undefined)
      }

      this.controller.EmitNextSelection.run(nextSelection.cellCount > 0 ? nextSelection : null)
      this.controller.EmitNextSelectionSlice.run()

    }

  }

}

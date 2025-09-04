import { IGridCellComponent, IGridRow, IGridRowComponent } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { ErrorDialogComponent } from '../../ui/dialogs/error-dialog/error-dialog.component'
import { WithDefaultFalse, WithDefaultTrue } from '../../utils/with-default'
import { Operation } from '../operation.abstract'

export class CommitRecords extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public async run(rows: IGridRow[], options: ICommitRecordsOptions = {}) {
    
    const buffers        = new Set<Promise<void>>()
    const rowComponents  = new Set<IGridRowComponent>()
    const cellComponents = new Set<IGridCellComponent>()

    const cells = this.cellOperations.GetAllCellMetaForDirtyRows.run(rows.map(r => r.rowKey))
    const invalidBlockingCell = cells.find(cell => {
      const validationState = this.cellOperations.GetCellValue.run(cell.coords)?.validationState
      return validationState?.nextIsValid === false && validationState.validationResults.find(v => v.nonBlocking !== true) !== undefined
    })

    if (invalidBlockingCell) {
      this.cellOperations.gridController.dialogs.open(ErrorDialogComponent, { data: "Validation errors need to be corrected before committing." })
        .afterClosed()
        .subscribe(_ => {
        this.selection.SelectCell.run(invalidBlockingCell.coords);
        this.selection.ScrollIntoView.run(invalidBlockingCell.coords);
      })
      return;
    }

    if (!WithDefaultFalse(options.dryRun)) {
        
      for (const row of rows) {
        if (row.isDeleted) this.rowOperations.DeleteRow.buffer(row.rowKey, { forceRowRemoval: true, emitEvent: true })
        if (row.isNew) {
          buffers.add(this.rowOperations.ResetRowStatus.buffer(row.rowKey))
          const rowComponent = this.rowOperations.RowComponents.findWithPrimaryKey(row.rowKey)
          if (rowComponent) rowComponents.add(rowComponent)
        }
      }

      for (const cell of cells) {
        const hasDraft = this.cellOperations.HasDraftValue.run(cell.coords)
        if (cell && hasDraft) {
          buffers.add(this.cellOperations.ClearCellDraftValue.buffer(cell.coords))
          const cellComponent = this.cellOperations.CellComponents.findWithCoords(cell.coords)
          if (cellComponent) cellComponents.add(cellComponent)
        }
        const rowComponent = this.rowOperations.RowComponents.findWithPrimaryKey(cell.coords.rowKey)
        if (rowComponent) rowComponents.add(rowComponent)
      }

      await Promise.all(buffers)

      rowComponents.forEach(row => this.rowOperations.CheckRowIcon.run(row))
      cellComponents.forEach(cell => this.cellOperations.SetCellStylesFromMeta.run(cell))
      
    }
  }

}

export interface ICommitRecordsOptions {
  dryRun?: boolean
}

import { IGridCellComponent, IGridRowComponent, IGridRowMeta } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { ErrorDialogComponent } from '../../ui/dialogs/error-dialog/error-dialog.component'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class CommitRecords extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public async run(rowMetas: IGridRowMeta[], options: ICommitRecordsOptions = {}) {
    
    const buffers        = new Set<Promise<void>>()
    const rowComponents  = new Set<IGridRowComponent>()
    const cellComponents = new Set<IGridCellComponent>()

    const cells = this.cellOperations.GetAllCellMetaForDirtyRows.run(rowMetas.map(r => r.rowKey))
    const invalidCell = cells.find(cell => this.cellOperations.GetCellValue.run(cell.coords)?.validationState?.nextIsValid === false)

    if (invalidCell) {
      this.cellOperations.gridController.dialogs.open(ErrorDialogComponent, { data: "Validation errors need to be corrected before committing." })
        .afterClosed()
        .subscribe(_ => {
        this.selection.selectCell(invalidCell.coords);
        this.selection.scrollIntoView(invalidCell.coords);
      })
      return;
    }

    for (const row of rowMetas) {
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

    if (WithDefaultTrue(options.emitEvent) === true) {
      this.gridEvents.RowsCommittedEvent.emit(rowMetas.map(r => r.rowKey))
    }

  }

}

export interface ICommitRecordsOptions {
  emitEvent?: boolean
}

import { IGridCellComponent, IGridRow, IGridRowComponent } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { Operation } from '../operation.abstract'

export class RevertRecords extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public async run(rows: IGridRow[]) {
    
    const columns   = this.dataSource.columns
    const buffering = new Set<Promise<void>>()
    const rowComponents: IGridRowComponent[]   = []
    const cellComponents: IGridCellComponent[] = []

    for (const row of rows) {
      if (row.isDeleted) {
        buffering.add(this.rowOperations.ResetRowStatus.buffer(row.rowKey))
        const rowComponent = this.rowOperations.RowComponents.findWithPrimaryKey(row.rowKey)
        if (rowComponent) rowComponents.push(rowComponent)
      }
      if (row.isNew) buffering.add(this.rowOperations.DeleteRow.buffer(row.rowKey, { emitEvent: false }))

      for (const col of columns) {
        const cellCoords = new GridCellCoordinates(row.rowKey, col.columnKey)
        const cellMeta   = this.cellOperations.GetCellMeta.run(cellCoords)
        if (cellMeta && this.cellOperations.HasDraftValue.run(cellCoords)) {
          this.cellOperations.ClearCellDraftValue.buffer(cellCoords)
          const cellComponent = this.cellOperations.CellComponents.findWithCoords(cellCoords)
          const rowComponent  = this.rowOperations.RowComponents.findWithPrimaryKey(cellMeta.coords.rowKey)
          if (cellComponent) cellComponents.push(cellComponent)
          if (rowComponent) rowComponents.push(rowComponent)
        }
      }
    }

    this.gridEvents.RowsRevertedEvent.emit(rows.map(r => r.rowKey))

    await Promise.all(buffering)

    rowComponents.forEach(row => this.rowOperations.CheckRowIcon.run(row))
    cellComponents.forEach(cell => this.cellOperations.SetCellStylesFromMeta.run(cell))

  }

}

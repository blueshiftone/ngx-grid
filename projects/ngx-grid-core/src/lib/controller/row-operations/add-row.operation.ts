import { EMetadataType } from '../../typings/enums'
import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class AddRow extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public buffer = (row: IGridRow, atIndex?: number) => this.bufferOperation.next([row, atIndex])

  private async _run(args: [IGridRow, number][]): Promise<void> {

    let firstEditableCell: null | TColumnKey = null

    let rowKey: TPrimaryKey = ''
    const buffers = new Set<Promise<void>>()

    for (const arg of args) {

      const [row, atIndex] = arg
      rowKey = row.rowKey

      this.dataSource.upsertRows(atIndex ?? -1, row)

      buffers.add(this.rowOperations.SetRowStatus.buffer(rowKey, ERowStatus.New))
      
      for (const columnKey of this.dataSource.columns) {
        const colMeta = this.columnOperations.GetColumnMeta.run(columnKey)
        const canUpdate = colMeta?.metadata.get<boolean>(EMetadataType.CanUpdate) !== false
        if (canUpdate && firstEditableCell === null) firstEditableCell = columnKey
        this.cellOperations.SetCellMeta.run(new GridCellCoordinates(rowKey, columnKey), [{ key: EMetadataType.CanUpdate, value: canUpdate }])
      }
    }

    await Promise.all(buffers)

    if (firstEditableCell !== null) this.selection.SelectCell.run(new GridCellCoordinates(rowKey, firstEditableCell))
    else this.selection.SelectRow.run(rowKey)
    this.selection.EmitNextSelectionSlice.run()

    this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}

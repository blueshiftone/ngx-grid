import { EMetadataType } from '../../typings/enums'
import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { BaseRowOperation } from './base-row-operation.abstract'

export class AddRow extends BaseRowOperation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory) }

  public buffer = (row: IGridRow, atIndex?: number) => this.bufferOperation.next([row, atIndex])

  private async _run(args: [IGridRow, number][]): Promise<void> {

    const data = this.gridOperations.source()?.data
    if (typeof data === 'undefined') return

    let firstEditableCell: null | TColumnKey = null

    let rowKey: TPrimaryKey = ''
    const buffers = new Set<Promise<void>>()

    for (const arg of args) {

      const [row, atIndex] = arg
      rowKey = row.rowKey

      if (typeof atIndex !== 'undefined' && atIndex > -1) data.value.rows.splice(atIndex, 0, row)
      else data.value.rows.push(row)

      data.value.rows = [...data.value.rows]

      this.rowOperations.rowKeyMap.set(rowKey, row)

      buffers.add(this.rowOperations.SetRowStatus.buffer(rowKey, ERowStatus.New))

      const cols = this.gridOperations.source()?.data.value.columns ?? []
      
      for (const columnKey of cols) {
        const colMeta = this.columnOperations.GetColumnMeta.run(columnKey)
        const canUpdate = colMeta?.metadata.get<boolean>(EMetadataType.CanUpdate) !== false
        if (canUpdate && firstEditableCell === null) firstEditableCell = columnKey
        this.cellOperations.SetCellMeta.run(new GridCellCoordinates(rowKey, columnKey), [{ key: EMetadataType.CanUpdate, value: canUpdate }])
      }
    }

    await Promise.all(buffers)

    data.next(data.value)
    if (firstEditableCell !== null) this.selection.selectCell(new GridCellCoordinates(rowKey, firstEditableCell))
    else this.selection.selectRow(rowKey)
    this.selection.emitNextSelectionSlice()

    this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}

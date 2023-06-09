import { ERowStatus } from '../../typings/enums'
import { IGridRow, IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { WithDefaultTrue } from '../../utils/with-default'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class SetRowStatus extends Operation {

  public bufferEvents = new BufferOperation((args: any) => this._bufferEvents(args))

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row: IGridRow, status: ERowStatus | keyof typeof ERowStatus, options?: ISetRowStatusOptions) : void
  public run(rowKey: TPrimaryKey, status: ERowStatus | keyof typeof ERowStatus, options?: ISetRowStatusOptions) : void 
  public run(rowKeyOrRow: TPrimaryKey | IGridRow, status: ERowStatus | keyof typeof ERowStatus, options?: ISetRowStatusOptions) : void {

    if (typeof status === 'string') status = ERowStatus[status]

    const row = typeof rowKeyOrRow === 'string' || typeof rowKeyOrRow === 'number' ? this.dataSource.getRow(rowKeyOrRow) : rowKeyOrRow
    
    if (!row) {
      console.warn(`Row with key ${rowKeyOrRow} not found`)
      return
    }

    if (status === ERowStatus.Draft && (row?.status === ERowStatus.New || row?.status === ERowStatus.Deleted)) return
    const statusChanged = row?.status !== status

    row.status = status

    if (status === ERowStatus.Committed) this.rowOperations.dirtyRowsMap.delete(row.rowKey)
    else                                 this.rowOperations.dirtyRowsMap.set(row.rowKey, row)

    if (WithDefaultTrue(options?.emitEvent && statusChanged)) {
      this.bufferEvents.next([[row]])
    }

  }

  private async _bufferEvents(args: [IGridRow][]) {
    const primaryKeys = new Set<TPrimaryKey>()
    
    for (const arg of args) {
      let [row] = arg
      primaryKeys.add(row.rowKey)
    }
    this.gridEvents.GridWasModifiedEvent.emit(true) 
    this.gridEvents.RowStatusChangedEvent.emit([...primaryKeys].map(pk => this.dataSource.getRow(pk)).filter(meta => meta).map(m => m?.clone()) as IGridRow[])
  }
}

export interface ISetRowStatusOptions {
  emitEvent?: boolean
}

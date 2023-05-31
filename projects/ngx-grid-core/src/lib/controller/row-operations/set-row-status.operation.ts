import { ERowStatus } from '../../typings/enums'
import { IGridRow, IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { DistinctValues } from '../../utils/distinct-values'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class SetRowStatus extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public buffer = (rowKey: TPrimaryKey, status: ERowStatus, options:ISetRowStatusOptions = {}) => this.bufferOperation.next([rowKey, status, options])

  private async _run(args: [TPrimaryKey, ERowStatus | keyof typeof ERowStatus, ISetRowStatusOptions][]) {

    let valueChanged = false
    let emitEvent = true 

    for (const arg of args) {
      let [rowKey, status, options] = arg

      if (typeof status === 'string') status = ERowStatus[status]

      const row = this.dataSource.getRow(rowKey)
      if (!row) {
        console.warn(`Row with key ${rowKey} not found`)
        continue
      }
      if (status === ERowStatus.Draft && (row?.status === ERowStatus.New || row?.status === ERowStatus.Deleted)) continue
      if (row?.status !== status) valueChanged = true

      row.status = status
  
      if (status === ERowStatus.Committed) this.rowOperations.dirtyRowsMap.delete(rowKey)
      else                                 this.rowOperations.dirtyRowsMap.set(rowKey, row)

      const rowComponent = this.rowOperations.RowComponents.findWithPrimaryKey(rowKey)
      if (rowComponent) {
        this.rowOperations.CheckRowIcon.run(rowComponent)
      }

      if (options.emitEvent === false) emitEvent = false
    }

    if (valueChanged) {
      this.gridEvents.GridWasModifiedEvent.emit(true) 
      const primaryKeys = DistinctValues(args.map(a => a[0]))
      if (emitEvent) {
        this.gridEvents.RowStatusChangedEvent.emit(primaryKeys.map(pk => this.dataSource.getRow(pk)).filter(meta => meta).map(m => m?.clone()) as IGridRow[])
      }
    }

  }

}

export interface ISetRowStatusOptions {
  emitEvent?: boolean
}

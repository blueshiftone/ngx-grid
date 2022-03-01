import { IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { DeleteFromArray } from '../../utils/array-delete'
import { BufferOperation } from '../buffer-operation'
import { BaseRowOperation } from './base-row-operation.abstract'

export class RemoveRow extends BaseRowOperation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))
  
  constructor(factory: IRowOperationFactory) { super(factory) }
  
  public buffer = (rowKey: TPrimaryKey) => {
    return this.bufferOperation.next([rowKey])
  }

  private  async _run(args: TPrimaryKey[][]): Promise<void> {
    const data = this.gridOperations.source()?.data
    if (typeof data === 'undefined') return
    
    for (const arg of args) {
      const [rowKey] = arg
      const row = this.rowOperations.GetRow.run(rowKey)
      DeleteFromArray(data.value.rows, row)
      data.value.rows = [...data.value.rows]
      this.rowOperations.rowKeyMap.delete(rowKey)
      this.rowOperations.dirtyRowsMap.delete(rowKey)
    }

    data.next(data.value)

    this.selection.removeOrphanedRows()

    this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}

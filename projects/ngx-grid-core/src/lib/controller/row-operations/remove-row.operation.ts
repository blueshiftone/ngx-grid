import { IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class RemoveRow extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))
  
  constructor(factory: IRowOperationFactory) { super(factory.gridController) }
  
  public buffer = (rowKey: TPrimaryKey) => {
    return this.bufferOperation.next([rowKey])
  }

  private  async _run(args: TPrimaryKey[][]): Promise<void> {
    
    this.dataSource.removeRows(...args.map(x => x[0]))
    for (const arg of args) {
      const [rowKey] = arg
      this.rowOperations.dirtyRowsMap.delete(rowKey) 
    }

    this.selection.RemoveOrphanedRows.run()

    this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}

import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridRowComponent, IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { WithDefaultTrue } from '../../utils/with-default'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class DeleteRow extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))
  
  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public buffer = (rowKey: TPrimaryKey, options: IDeleteRowOperationOptions = {}) => this.bufferOperation.next([rowKey, options])

  private async _run(args: [TPrimaryKey, IDeleteRowOperationOptions][]): Promise<void> {   

    const promises = new Set<Promise<any>>()
    const rowComponents: IGridRowComponent[] = []

    for (const arg of args) {
      const [rowKey, options] = arg

      const row = this.dataSource.getRow(rowKey)
      const canDeleteRow = this.rowOperations.GetRowCanDelete.run(row ?? rowKey)

      if (!canDeleteRow && row?.isNew !== true) continue
      
      if (row?.isNew === true || options.forceRowRemoval === true) {

        promises.add(this.rowOperations.RemoveRow.buffer(rowKey))

        if (WithDefaultTrue(options.emitEvent) === true) this.gridEvents.RowDeletedEvent.emit(rowKey)

      } else {
        promises.add(this.rowOperations.SetRowStatus.buffer(rowKey, ERowStatus.Deleted, { emitEvent: options.emitEvent }))
      }

      const rowComponent = this.rowOperations.RowComponents.findWithPrimaryKey(rowKey)
        
      if (rowComponent) rowComponents.push(rowComponent)
      
    }

    await Promise.all(promises)

    rowComponents.forEach(row => this.rowOperations.CheckRowIcon.run(row))
    
    this.gridEvents.GridWasModifiedEvent.emit(true)

  }
}

export interface IDeleteRowOperationOptions {
  emitEvent?      : boolean
  forceRowRemoval?: boolean
}

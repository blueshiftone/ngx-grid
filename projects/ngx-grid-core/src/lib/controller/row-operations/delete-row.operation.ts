import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridRow, IGridRowComponent, IRowOperationFactory } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { WithDefaultTrue } from '../../utils/with-default-true'
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

      const rowMeta = this.rowOperations.GetRowMeta.run(rowKey)

      if (rowMeta?.canDelete !== true) continue
      
      if (rowMeta?.isNew === true || options.forceRowRemoval === true) {

        const filteredRows          = this._filteredRows
        const sortedRows            = this._sortedRows
        let   ar: null | IGridRow[] = null

        if   (filteredRows ?? null !== null)  ar = filteredRows
        else if (sortedRows ?? null !== null) ar = sortedRows

        const row = this.rowOperations.GetRow.run(rowKey)

        if (ar && row) {
          const index = ar?.indexOf(row)
          ar.splice(index, 1)
          if (typeof filteredRows !== 'undefined') this.gridEvents.RowsFilteredEvent.emit([...ar])
          else {
            const sorted = this.gridEvents.ColumnSortByChangedEvent.state!
            sorted.rows = [...ar]
            this.gridEvents.ColumnSortByChangedEvent.emit(sorted)
          }
        }

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

  private get _sortedRows() {
    return this.gridEvents.ColumnSortByChangedEvent.state?.rows || null
  }

  private get _filteredRows() {
    return this.gridEvents.RowsFilteredEvent.state || null
  }

}

export interface IDeleteRowOperationOptions {
  emitEvent?      : boolean
  forceRowRemoval?: boolean
}

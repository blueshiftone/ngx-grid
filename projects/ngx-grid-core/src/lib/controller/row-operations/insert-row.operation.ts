import { IGridRow, IRowOperationFactory } from '../../typings/interfaces'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { BufferOperation } from '../buffer-operation'
import { BaseRowOperation } from './base-row-operation.abstract'


export class InsertRow extends BaseRowOperation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory) }

  public buffer = (
    insertRow: IGridRow,
    options  : IInsertRowOperationOptions = {}
  ) => this.bufferOperation.next([insertRow, options ])

  private async _run(args: [IGridRow, IInsertRowOperationOptions][]): Promise<void> {

    const rows         = this.rowOperations.GetAllRows.filteredRows()
    const filteredRows = this._filteredRows
    const sortedRows   = this._sortedRows
  
    for (const arg of args) {
      
      let [insertRow, options] = arg

      if (typeof this.rowOperations.GetRow.run(insertRow.rowKey) !== 'undefined') continue

      options.increment = Math.max(0, Math.min(options.increment ?? 0, 1))
      
      const index       = options.referenceRow ? rows.indexOf(options.referenceRow) + options.increment : 0
      const globalIndex = options.referenceRow ? this.rowOperations.GetIndexOfRow.run(options.referenceRow) + options.increment : 0

      let ar: null | IGridRow[] = null

      if   (filteredRows ?? null !== null)  ar = filteredRows
      else if (sortedRows ?? null !== null) ar = sortedRows

      if (ar) {
        ar.splice(index, 0, insertRow)
        if (typeof filteredRows !== 'undefined') this.gridEvents.RowsFilteredEvent.emit([...ar])
        else {
          const sorted = this.gridEvents.ColumnSortByChangedEvent.state!
          sorted.rows = [...ar]
          this.gridEvents.ColumnSortByChangedEvent.emit(sorted)
        }
      }

      this.rowOperations.AddRow.buffer(insertRow, globalIndex)

      if (WithDefaultTrue(options.emitEvent) === true) {
        this.gridEvents.RowInsertedEvent.emit(insertRow)
      }

    }

  }

  private get _sortedRows() {
    return this.gridEvents.ColumnSortByChangedEvent.state?.rows || null
  }

  private get _filteredRows() {
    return this.gridEvents.RowsFilteredEvent.state || null
  }

}

export interface IInsertRowOperationOptions {
  referenceRow?: IGridRow,
  increment?   : number,
  emitEvent?   : boolean
}

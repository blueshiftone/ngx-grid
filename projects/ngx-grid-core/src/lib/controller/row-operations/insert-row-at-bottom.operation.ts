import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class InsertRowAtBottom extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const rows = this._visibleRows
    const referenceRow = rows[rows.length-1]
    this.rowOperations.InsertRowAfter.run(row, referenceRow)
  }  

  private get _visibleRows() {
    return this.rowOperations.GetAllRows.filteredRows() ?? []
  }
}

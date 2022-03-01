import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class InsertRowAtTop extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const referenceRow = this._visibleRows[0]
    this.rowOperations.InsertRowBefore.run(row, referenceRow)
  }  

  private get _visibleRows() {
    return this.rowOperations.GetAllRows.filteredRows() ?? []
  }
}

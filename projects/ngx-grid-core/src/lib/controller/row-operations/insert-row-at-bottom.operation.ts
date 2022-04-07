import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class InsertRowAtBottom extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const rows = this._visibleRows
    const referenceRow = rows[rows.length-1]
    this.rowOperations.InsertRowAfter.run(row, referenceRow)
  }  

  private get _visibleRows() {
    return this.rowOperations.GetAllRows.filteredRows() ?? []
  }
}

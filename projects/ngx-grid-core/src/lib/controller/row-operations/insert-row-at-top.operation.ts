import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class InsertRowAtTop extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const referenceRow = this._visibleRows[0]
    this.rowOperations.InsertRowBefore.run(row, referenceRow)
  }  

  private get _visibleRows() {
    return this.rowOperations.GetAllRows.filteredRows() ?? []
  }
}

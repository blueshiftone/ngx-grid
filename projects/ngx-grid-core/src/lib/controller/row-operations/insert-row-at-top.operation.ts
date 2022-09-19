import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class InsertRowAtTop extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const referenceRow = this.dataSource.rows.latestValue[0]
    this.rowOperations.InsertRowBefore.run(row, referenceRow)
  }
}

import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class InsertRowAfter extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(insertRow: IGridRow, referenceRow: IGridRow): void {

    const increment = 1
    this.rowOperations.InsertRow.buffer(insertRow, { increment, referenceRow })
    
  }

}

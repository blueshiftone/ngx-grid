import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class InsertRowAfter extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(insertRow: IGridRow, referenceRow: IGridRow): void {

    const increment = 1
    this.rowOperations.InsertRow.buffer(insertRow, { increment, referenceRow })
    
  }

}

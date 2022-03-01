import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class CommitAll extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run() {
    
    this.gridOperations.CommitRecords.run([...this.rowOperations.dirtyRowsMap.values()])

  }

}

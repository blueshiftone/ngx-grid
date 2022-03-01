import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class RevertAll extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run() {
    
    this.gridOperations.RevertRecords.run([...this.rowOperations.dirtyRowsMap.values()])

  }

}

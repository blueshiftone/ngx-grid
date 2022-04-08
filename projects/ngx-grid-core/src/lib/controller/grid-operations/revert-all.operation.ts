import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class RevertAll extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run() {
    
    this.gridOperations.RevertRecords.run([...this.rowOperations.dirtyRowsMap.values()])

  }

}

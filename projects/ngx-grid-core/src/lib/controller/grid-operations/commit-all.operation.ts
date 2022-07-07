import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'
import { ICommitRecordsOptions } from './commit-records.operation'

export class CommitAll extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(options: ICommitRecordsOptions = {}) {
    
    this.gridOperations.CommitRecords.run([...this.rowOperations.dirtyRowsMap.values()], options)

  }

}

import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'
import { ICommitRecordsOptions } from './commit-records.operation'

export class CommitSelected extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(options: ICommitRecordsOptions = {}) {
    const slice = this._selectionSlice
    if (slice) {
      const rows = slice.rowKeys.map(key => this.dataSource.getRow(key)).filter(meta => typeof meta !== 'undefined') as IGridRow[]
      this.gridOperations.CommitRecords.run(rows, options)
    }
  }

  private get _selectionSlice() {
    return this.gridEvents.GridSelectionSliceExtractedEvent.state
  }

}

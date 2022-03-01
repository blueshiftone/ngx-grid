import { IGridRowMeta } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class CommitSelected extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run() {
    const slice = this._selectionSlice
    if (slice) {
      const rows = slice.rowKeys.map(key => this.rowOperations.GetRowMeta.run(key)).filter(meta => typeof meta !== 'undefined') as IGridRowMeta[]
      this.gridOperations.CommitRecords.run(rows)
    }
  }

  private get _selectionSlice() {
    return this.gridEvents.GridSelectionSliceExtractedEvent.state
  }

}

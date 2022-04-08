import { ERowStatus } from '../../typings/enums/row-status.enum'
import { IGridCellMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class ResetRowStatus extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  private async _run(args: [TPrimaryKey, ERowStatus][]) {

    const promises = new Set<Promise<void>>()

    for (const arg of args) {

      let [rowKey, status] = arg

      const columns = this.columnOperations.GetColumns.run()

      const cellMeta = columns
        .map<IGridCellMeta | undefined>(columnKey => this.cellOperations.GetCellMeta.run(new GridCellCoordinates(rowKey, columnKey)))
        .filter(item => typeof item !== 'undefined') as IGridCellMeta[]

      const hasDraftValue = typeof cellMeta.find(item => this.cellOperations.HasDraftValue.run(item.coords)) !== 'undefined'

      if (hasDraftValue) status = ERowStatus.Draft

      promises.add(this.rowOperations.SetRowStatus.buffer(rowKey, status))
    }

    await Promise.all(promises)

  }

  public buffer(rowKey: TPrimaryKey, status = ERowStatus.Committed) {
    return this.bufferOperation.next([rowKey, status])
  }

}

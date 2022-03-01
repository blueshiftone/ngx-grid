import { IGridRowMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class RemoveRowMeta extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(rowKey: TPrimaryKey) {
    this._rowMeta.delete(rowKey)
  }

  private get _rowMeta(): Map<TPrimaryKey, IGridRowMeta> { return this.gridOperations.source()?.rowMeta ?? new Map() }

}

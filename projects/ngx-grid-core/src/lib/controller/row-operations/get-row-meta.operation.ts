import { IGridRowMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetRowMeta extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(rowKey: TPrimaryKey): IGridRowMeta | undefined {
    return this._rowMeta.get(rowKey)
  }

  private get _rowMeta(): Map<TPrimaryKey, IGridRowMeta> { return this.gridOperations.source()?.rowMeta ?? new Map() }

}

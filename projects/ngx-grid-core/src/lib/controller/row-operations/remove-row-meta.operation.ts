import { IGridRowMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class RemoveRowMeta extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey) {
    this._rowMeta.delete(rowKey)
  }

  private get _rowMeta(): Map<TPrimaryKey, IGridRowMeta> { return this.dataSource.rowMeta ?? new Map() }

}

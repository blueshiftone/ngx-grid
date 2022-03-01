import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class RemoveCellMeta extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(columnKey: TColumnKey, rowKey: TPrimaryKey) {
    this.gridOperations.source()?.cellMeta.delete(`${columnKey}>${rowKey}`)
  }

}

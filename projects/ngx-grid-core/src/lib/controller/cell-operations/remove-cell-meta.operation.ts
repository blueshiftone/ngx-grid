import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class RemoveCellMeta extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(columnKey: TColumnKey, rowKey: TPrimaryKey) {
    this.dataSource.cellMeta.delete(`${columnKey}>${rowKey}`)
  }

}

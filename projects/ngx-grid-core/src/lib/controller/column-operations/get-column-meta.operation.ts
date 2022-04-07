import { IGridColumnMeta } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetColumnMeta extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(columnKey: TColumnKey): IGridColumnMeta | undefined {
    return this.dataSource.columnMeta.find(meta => meta.columnKey === columnKey)
  }

  public getAll(): IGridColumnMeta[] {
    return this.dataSource.columnMeta
  }

}

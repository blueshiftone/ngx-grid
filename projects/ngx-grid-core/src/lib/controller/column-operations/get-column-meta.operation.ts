import { IGridColumnMeta } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumnMeta extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run(columnKey: TColumnKey): IGridColumnMeta | undefined {
    return this._colMeta.find(meta => meta.columnKey === columnKey)
  }

  public getAll(): IGridColumnMeta[] {
    return this._colMeta
  }

  private get _colMeta(): Array<IGridColumnMeta> { return this.gridOperations.source()?.columnMeta ?? [] }

}

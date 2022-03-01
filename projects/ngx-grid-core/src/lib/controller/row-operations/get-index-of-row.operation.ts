import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { IGridRow } from '../../typings/interfaces/grid-row.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetIndexOfRow extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(input: IGridRow | TPrimaryKey): number {
    let row: IGridRow | undefined
    if   (typeof input === 'object') row = input as IGridRow
    else row                             = this.rowOperations.GetRow.run(input as TPrimaryKey)
    return typeof row !== 'undefined' ? this.gridOperations.source()?.data.value.rows.indexOf(row) ?? -1 : -1
  }

}

import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetRelatedGridRow extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(gridID?: string, rowKey?: TPrimaryKey): IGridRow | undefined {
    if (typeof gridID === 'undefined' || typeof rowKey === 'undefined') return undefined
    const grid = this.gridOperations.relatedDataMap.get(gridID)
    const row = grid?.rowMap.get(rowKey)
    return row
  }
}

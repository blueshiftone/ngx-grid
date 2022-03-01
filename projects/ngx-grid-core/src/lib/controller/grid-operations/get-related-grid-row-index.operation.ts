import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetRelatedGridRowIndex extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(row: IGridRow, gridID?: string): number {
    if (typeof gridID === 'undefined') return -1
    const grid = this.gridOperations.relatedDataMap.get(gridID)
    return grid?.source.data.value.rows.indexOf(row) ?? -1
  }
}

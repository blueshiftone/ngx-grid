import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetRelatedGridRowIndex extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(row: IGridRow, gridID?: string): number {
    if (typeof gridID === 'undefined') return -1
    const source = this.gridOperations.GetRelatedData.run(gridID)
    return source?.rows.latestValue.indexOf(row) ?? -1
  }
}

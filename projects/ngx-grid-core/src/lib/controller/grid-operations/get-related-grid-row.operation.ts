import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRelatedGridRow extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(gridID?: string, rowKey?: TPrimaryKey): IGridRow | undefined {
    if (gridID === undefined || rowKey === undefined) return undefined
    return this.gridOperations.relatedDataSources.get(gridID)?.getRow(rowKey)
  }
}

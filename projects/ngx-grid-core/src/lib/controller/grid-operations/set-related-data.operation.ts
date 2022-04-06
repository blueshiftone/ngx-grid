import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class SetRelatedData extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(gridID: string, relatedGridSource: IGridDataSource) {
    const parentGridSource = this.gridOperations.source()
    if (!parentGridSource) throw new Error("parentGridSource is undefined")
    return parentGridSource.relatedData.set(gridID, relatedGridSource)
  }
}

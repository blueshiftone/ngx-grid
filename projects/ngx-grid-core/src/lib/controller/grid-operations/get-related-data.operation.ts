import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetRelatedData extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(gridID: string) {
    return this.gridOperations.source()?.relatedData.get(gridID)
  }
}

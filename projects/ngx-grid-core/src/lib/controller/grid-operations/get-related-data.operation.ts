import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetRelatedData extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(gridID: string) {
    return this.dataSource.relatedData.get(gridID)
  }
}

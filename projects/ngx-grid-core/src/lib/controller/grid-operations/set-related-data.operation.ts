import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetRelatedData extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(gridID: string, relatedGridSource: IGridDataSource) {
    return this.dataSource.relatedData.set(gridID, relatedGridSource)
  }
}

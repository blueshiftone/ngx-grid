import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetGridId extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(): string {
    return this.gridOperations.source()?.dataGridID ?? ''
  }

}

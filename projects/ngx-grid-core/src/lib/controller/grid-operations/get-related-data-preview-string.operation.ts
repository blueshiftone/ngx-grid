import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRelatedDataPreviewString extends Operation {

  constructor(
    factory: IGridOperationFactory
  ) { super(factory.gridController) }

  public run(gridID: string, rowKey: TPrimaryKey): string {
    const source = this.gridOperations.GetRelatedData.run(gridID)
    return this.rowOperations.GetRowPreviewString.run(rowKey, source)    
  }
}

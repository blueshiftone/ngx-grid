import { IGridRowMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowCanDelete extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(input: TPrimaryKey | IGridRowMeta): boolean {
    let rowMeta: IGridRowMeta | undefined
    if (typeof input === 'string' || typeof input === 'number') {
      rowMeta = this.rowOperations.GetRowMeta.run(input)
    } else {
      rowMeta = input
    }
    return (rowMeta?.canDelete ?? this.gridOperations.gridController.dataSource.canDelete) === true
  }

}

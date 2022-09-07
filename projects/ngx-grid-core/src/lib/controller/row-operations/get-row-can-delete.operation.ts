import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowCanDelete extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(input: TPrimaryKey | IGridRow): boolean {
    let row: IGridRow | undefined
    if (typeof input === 'string' || typeof input === 'number') {
      row = this.dataSource.getRow(input)
    } else {
      row = input
    }
    return (row?.canDelete ?? this.gridOperations.gridController.dataSource.canDelete) === true
  }

}

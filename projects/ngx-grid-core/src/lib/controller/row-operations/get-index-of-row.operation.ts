import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { IGridRow } from '../../typings/interfaces/grid-row.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetIndexOfRow extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(input: IGridRow | TPrimaryKey): number {
    let row: IGridRow | undefined
    
    if   (typeof input === 'object') row = input
    else row = this.dataSource.getRow(input)

    return row !== undefined ? this.dataSource.rows.latestValue.indexOf(row) ?? -1 : -1
  }

}

import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class FilterRelatedDataRows extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }
  
  public run(gridID: string, rowKeys: TPrimaryKey[]): IGridRow[] {
    const grid = this.gridOperations.relatedDataMap.get(gridID)
    const rows: IGridRow[] = []
    for (const primaryKey of rowKeys) {
      const row = grid?.rowMap.get(primaryKey)
      if (typeof row !== 'undefined') rows.push(row)
    }
    return rows
  }

}

import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class FilterRelatedDataRows extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }
  
  public run(gridID: string, rowKeys: TPrimaryKey[]): IGridRow[] {
    const source = this.gridOperations.GetRelatedData.run(gridID)
    const rows: IGridRow[] = []
    for (const primaryKey of rowKeys) {
      if (source?.rowExists(primaryKey)) {
        rows.push(source.getRow(primaryKey)!)
      }
    }
    return rows
  }

}

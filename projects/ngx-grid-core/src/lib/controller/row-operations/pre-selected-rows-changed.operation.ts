import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class PreSelectedRowsChanged extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }
  
  public run(selection: [TPrimaryKey | undefined | null, TPrimaryKey | undefined | null]): void {
    const [prev, next] = selection

    const rows = new Set<TPrimaryKey>()
    if (prev !== null && prev !== undefined) rows.add(prev)
    if (next !== null && next !== undefined) rows.add(next)

    const allRows = this.rowOperations.RowComponents.filterWitPrimaryKeyIn(rows)

    allRows.forEach(row => {
      this.rowOperations.CheckRowIcon.run(row)
      this.rowOperations.SetRowSelectionClasses.run(row)
    })
  }
}

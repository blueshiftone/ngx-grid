import { IGridSelectionRange } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SelectedRowsChanged extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }
  
  public run(selection: [IGridSelectionRange | undefined | null, IGridSelectionRange | undefined | null],): void {
    const [prevSelection, nextSelection] = selection

    const allRows = this.rowOperations.RowComponents.filterWitPrimaryKeyIn(new Set([
      ...Array.from(nextSelection?.rows || []),
      ...Array.from(nextSelection?.secondarySelection?.rows || []),
      ...Array.from(prevSelection?.rows || []),
      ...Array.from(prevSelection?.secondarySelection?.rows || []),
    ]))

    allRows.forEach(row => {
      this.rowOperations.CheckRowIcon.run(row)
      this.rowOperations.SetRowSelectionClasses.run(row, nextSelection)
    })
  }
}

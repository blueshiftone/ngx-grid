import { IGridSelectionRange } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class SelectedRowsChanged extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }
  
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

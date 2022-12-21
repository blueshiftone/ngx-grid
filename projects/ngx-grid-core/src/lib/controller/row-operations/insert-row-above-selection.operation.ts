import { IGridSelectionRange } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class InsertRowAboveSelection extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const selection = this._getSelection()
    if (!selection) return
    const referenceRow = this.dataSource.getRow(selection.rowKeys[0])
    if (referenceRow === undefined) return
    this.rowOperations.InsertRowBefore.run(row, referenceRow)
  }  

  private _getSelection(): IGridSelectionRange | undefined | null {
    return this.gridEvents.CellSelectionChangedEvent.state
  }
}

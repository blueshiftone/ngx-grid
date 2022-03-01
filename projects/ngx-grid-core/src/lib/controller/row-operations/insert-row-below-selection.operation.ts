import { IGridSelectionRange } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { BaseRowOperation } from './base-row-operation.abstract'

export class InsertRowBelowSelection extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(row = this.rowOperations.GenerateNewRow.run()): void {
    const selection = this._getSelection()
    if (!selection) return
    const referenceRow = this.rowOperations.GetRow.run(selection.rowKeys[selection.rowKeys.length - 1])
    if (typeof referenceRow === 'undefined') return
    this.rowOperations.InsertRowAfter.run(row, referenceRow)
  }  

  private _getSelection(): IGridSelectionRange | undefined | null {
    return this.gridEvents.CellSelectionChangedEvent.state
  }
}

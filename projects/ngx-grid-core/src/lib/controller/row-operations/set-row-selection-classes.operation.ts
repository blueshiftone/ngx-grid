import { IGridRowComponent, IGridSelectionRange } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetRowSelectionClasses extends Operation {
  
  private readonly rowInSelectionClassName = 'row-in-selection'
  
  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row: IGridRowComponent, selection?: IGridSelectionRange | null): void {
    if (typeof selection === 'undefined') selection = this.selection.latestSelection
    row.toggleClass(
      this.rowInSelectionClassName,
      selection?.includesRow(row.rowKey)
      || (selection?.secondarySelection && !selection.secondarySelection.isSubtracting && selection?.secondarySelection?.includesRow(row.rowKey))
      || false)

    row.toggleClass('pre-selected', this._preSelected === row.rowKey)
  }

  public clear(rows: IGridRowComponent[]): void {
    rows.forEach(r => r.toggleClass(this.rowInSelectionClassName, false))
  }

  private get _preSelected() {
    return this.gridEvents.RowPreselectedEvent.state
  }

}

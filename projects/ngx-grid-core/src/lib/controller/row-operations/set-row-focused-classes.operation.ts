import { IGridCellFocused, IGridRowComponent } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetRowFocusedClasses extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  private readonly className = 'focused'

  public run(row: IGridRowComponent, focused?: IGridCellFocused): void {
    if (typeof focused === 'undefined') focused = this._focused
    row.toggleClass(this.className, focused?.isRow(row.rowKey) === true)
  }

  public clear(rows: IGridRowComponent[] | Set<IGridRowComponent>): void {
    rows.forEach(r => r.toggleClass(this.className, false))
  }

  private get _focused():IGridCellFocused | undefined {
    return this.gridEvents.CellFocusChangedEvent.state
  }

}

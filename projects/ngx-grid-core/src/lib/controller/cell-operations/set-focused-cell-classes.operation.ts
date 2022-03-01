import { IGridCellComponent, IGridCellFocused } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class SetFocusedCellClasses extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  private readonly className = 'focused'

  public run(cell: IGridCellComponent, focused?: IGridCellFocused): void {
    if (typeof focused === 'undefined') focused = this._focused
    cell.toggleClass(this.className, focused?.isCell(cell.coordinates) ?? false)
  }

  public clear(cells: IGridCellComponent[]): void {
    cells.forEach(c => c.toggleClass(this.className, false))
  }

  private get _focused():IGridCellFocused | undefined {
    return this.gridEvents.CellFocusChangedEvent.state
  }

}

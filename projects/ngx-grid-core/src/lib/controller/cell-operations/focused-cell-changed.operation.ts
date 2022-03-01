import { IGridCellFocused } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class FocusedCellChanged extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  private readonly className = 'focused'

  public run(focusedChange: [IGridCellFocused?, IGridCellFocused?]): void {
    const [prev, next] = focusedChange.map(c => this.cellOperations.CellComponents.findWithCoords(c))
    prev?.toggleClass(this.className, false)
    prev?.focus.next(false)
    next?.toggleClass(this.className, true)
    next?.focus.next(true)
  }

}

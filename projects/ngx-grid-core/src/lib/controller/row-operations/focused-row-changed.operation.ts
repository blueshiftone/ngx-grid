import { IGridCellFocused } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class FocusedRowChanged extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(focusedChange: [IGridCellFocused?, IGridCellFocused?]): void {
    const [prev, next] = focusedChange
    if (prev && prev.rowKey !== next?.rowKey) {
      const prevComponent = this.rowOperations.RowComponents.findWithPrimaryKey(prev.rowKey)
      if (prevComponent) {
        this.rowOperations.CheckRowIcon.run(prevComponent)
        this.rowOperations.SetRowFocusedClasses.run(prevComponent, next)
      }
    }
    if (next) {
      const nextComponent = this.rowOperations.RowComponents.findWithPrimaryKey(next.rowKey)
      if (nextComponent) {
        this.rowOperations.CheckRowIcon.run(nextComponent)
        this.rowOperations.SetRowFocusedClasses.run(nextComponent, next)
      }
    }
  }

}

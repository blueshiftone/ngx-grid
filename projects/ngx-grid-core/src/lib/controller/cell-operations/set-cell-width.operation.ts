import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class SetCellWidth extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  public run(cell: IGridCellComponent): void {
    const width = this._colWidths?.columns.find(col => col.columnKey === cell.columnKey)?.width || 0
    cell.style.width = `${width}px`
  }

  private get _colWidths() { return this.gridEvents.ColumnWidthChangedEvent.state }
}

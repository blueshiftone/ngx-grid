import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetCellWidth extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(cell: IGridCellComponent): void {
    cell.style.width = `${this.columnOperations.GetColumnWidth.run(cell.coordinates.columnKey)}px`
  }

}

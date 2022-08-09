import { IGridCellComponent } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SetColumnWidth extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run (cells: Set<IGridCellComponent>, width: number): void {
    cells.forEach(cell => cell.style.width = width === Infinity ? `` : `${width}px`)
  }

}

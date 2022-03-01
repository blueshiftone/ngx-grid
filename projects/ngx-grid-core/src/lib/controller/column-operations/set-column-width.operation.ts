import { IGridCellComponent } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class SetColumnWidth extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run (column: Set<IGridCellComponent>, width: number): void {
    column.forEach(cell => cell.style.width = `${width}px`)
  }

}



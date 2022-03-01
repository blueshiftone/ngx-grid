import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetFocusedCell extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(): IGridCellComponent | undefined {
    const cellPos = this.gridEvents.CellFocusChangedEvent.state
    return cellPos ? this.cellOperations.CellComponents.findWithCoords(cellPos) : undefined
  }

}

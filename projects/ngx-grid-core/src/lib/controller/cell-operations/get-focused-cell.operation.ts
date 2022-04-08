import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetFocusedCell extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(): IGridCellComponent | undefined {
    const cellPos = this.gridEvents.CellFocusChangedEvent.state
    return cellPos ? this.cellOperations.CellComponents.findWithCoords(cellPos) : undefined
  }

}

import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellValue extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates) {
    return this.dataSource.getRow(coordinates.rowKey)?.getValue(coordinates.columnKey) ?? null
  }

}

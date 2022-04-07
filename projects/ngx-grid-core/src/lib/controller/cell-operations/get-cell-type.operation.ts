import { IGridCellCoordinates, IGridDataType } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellType extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates): IGridDataType {
    return this.cellOperations.GetCellMeta.run(coordinates)?.type || this._getColMeta(coordinates.columnKey)?.type || { name: 'Text' }
  }

  private _getColMeta  = (columnKey: string) => this.dataSource.columnMeta.find(c => c.columnKey === columnKey)

}

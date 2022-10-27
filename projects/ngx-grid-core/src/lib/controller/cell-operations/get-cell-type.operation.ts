import { IGridCellCoordinates, IGridDataType } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellType extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates): IGridDataType {
    const output = this.cellOperations.GetCellMeta.run(coordinates)?.type || this._getCol(coordinates.columnKey)?.type
    if (coordinates.columnKey === this.dataSource.primaryColumnKey && !output) {
      return { name: 'Number' }
    }
    return output ?? { name: 'Text' }
  }

  private _getCol  = (columnKey: string) => this.dataSource.getColumn(columnKey)

}

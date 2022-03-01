import { IGridCellCoordinates, IGridDataType } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellType extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(coordinates: IGridCellCoordinates): IGridDataType {
    return this.cellOperations.GetCellMeta.run(coordinates)?.type || this._getColMeta(coordinates.columnKey)?.type || { name: 'Text' }
  }

  private _getColMeta  = (columnKey: string) => this.gridOperations.source()?.columnMeta.find(c => c.columnKey === columnKey)

}

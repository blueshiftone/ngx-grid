import { ECellActivityState } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class SetCellActivityState extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(rowKey: TPrimaryKey, activityState: ECellActivityState): void
  public run(rowKeys: TPrimaryKey[], activityState: ECellActivityState): void
  public run(cellCoordinates: IGridCellCoordinates, activityState: ECellActivityState): void
  public run(cellCoordinates: IGridCellCoordinates[], activityState: ECellActivityState): void
  public run(input: IGridCellCoordinates | IGridCellCoordinates[] | TPrimaryKey | TPrimaryKey[], activityState: ECellActivityState): void {
    if (!Array.isArray(input) && typeof input === 'object') {
      input = [input]
    } else if (typeof input === 'string' || typeof input === 'number') {
      input = this._getRowCellCoordinates(input)
    } else if (typeof input[0] !== 'object') {
      const rowKeys = input as TPrimaryKey[]
      input = [] as IGridCellCoordinates[]
      for (const rowkey of rowKeys) {
        input.push(...this._getRowCellCoordinates(rowkey))
      }
    }
    for (const coords of input as IGridCellCoordinates[]) {
      this.cellOperations.SetCellMeta.run(coords, { activityState })
      const component = this.cellOperations.CellComponents.findWithCoords(coords)
      if (component) {
        this.cellOperations.SetCellStylesFromMeta.run(component)
      }
    }
  }

  private _getRowCellCoordinates(rowKey: TPrimaryKey): IGridCellCoordinates[] {
    return this.dataSource.columns.map(col => new GridCellCoordinates(rowKey, col.columnKey))
  }

}

import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { Operation } from '../operation.abstract'

export class UpsertDatasourceRows extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rows: IGridRow[]): void {
    this.dataSource.upsertRows(rows)
    for (const row of rows) {
      for (const item of row.valuesArray) {
        const coords = new GridCellCoordinates(row.rowKey, item.columnKey)
        this.cellOperations.CellComponents.findWithCoords(coords)?.detectChanges()
      }
    }
  }
}

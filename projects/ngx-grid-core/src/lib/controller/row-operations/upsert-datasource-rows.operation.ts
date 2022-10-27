import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { Operation } from '../operation.abstract'

export class UpsertDatasourceRows extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rows: IGridRow[]): void {
    for (const row of rows) {
      const existing = this.rowOperations.GetRow.run(row.rowKey) !== undefined
      if (!existing) {
        this.dataSource.insertNewRows(row)
      } else {
        for (const item of row.valuesArray) {
          const coords = new GridCellCoordinates(row.rowKey, item.columnKey)
          this.cellOperations.SetCellValue.run(coords, item.value.value, { emitEvent: false })
          this.cellOperations.CellComponents.findWithCoords(coords)?.detectChanges()
        }
      }
    }
  }
}

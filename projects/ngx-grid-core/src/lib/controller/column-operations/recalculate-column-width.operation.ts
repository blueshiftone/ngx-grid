import { IGridCellComponent } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class RecalculateColumnWidth extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run (...columnKeys : string[]): void {
    const cellMap = new Map<TColumnKey, Set<IGridCellComponent>>()
    for (const col of columnKeys) {
      const cellComponents = this.cellOperations.CellComponents.findForColumn(col)
      this.columnOperations.SetColumnWidth.run(cellComponents, Infinity)
      cellMap.set(col, cellComponents)
    }
    window.requestAnimationFrame(_ => {
      const colWidths = this.gridEvents.ColumnWidthChangedEvent.state
      if (!colWidths) return
      for (const entry of cellMap.entries()) {
        const [colKey, cellComponents] = entry
        const newWidth = Math.max(...[...cellComponents].map(c => c.element.getBoundingClientRect().width))
        colWidths.setWidth(colKey, newWidth)
      }
      this.gridEvents.ColumnWidthChangedEvent.emit(colWidths)
    })
  }

}

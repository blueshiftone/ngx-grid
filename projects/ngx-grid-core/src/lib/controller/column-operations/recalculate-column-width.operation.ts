import { IGridCellComponent } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class RecalculateColumnWidth extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

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
      for (const [colKey, cellComponents] of cellMap.entries()) {
        const newWidth = Math.max(...[...cellComponents].map(c => c.element.getBoundingClientRect().width))
        colWidths.setWidth(colKey, newWidth)
      }
      this.gridEvents.ColumnWidthChangedEvent.emit(colWidths)
    })
  }

}

import { moveItemInArray } from '@angular/cdk/drag-drop'

import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class ChangeColumnOrder extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(changedIndexes: [number, number]) {
    let   [prevIndex, nextIndex]   = changedIndexes
    let   prevIndexStart: number   = prevIndex
    const indexesChanged: number[] = []
    
    if (prevIndexStart < nextIndex) while (prevIndexStart <= nextIndex) indexesChanged.push(prevIndexStart++)
    else                            while (prevIndexStart >= nextIndex) indexesChanged.push(prevIndexStart--)

    moveItemInArray(this.dataSource.columns, changedIndexes[0], changedIndexes[1])

    if (this.dataSource.hasColumnSubset()) {
      // If the column subset is active, we need to mirror the order change in the underlying columns
      const columnIndex = changedIndexes[1]
      let [l, r] = [columnIndex - 1, columnIndex + 1]
      const underlying = this.dataSource.getUnderlyingColumns()
      let newIndex = -1
      // find the first column to the left or right that appears in the underlying columns
      while (l >= 0 || r < this.dataSource.columns.length) {
        if (l > -1) {
          const colIndex = underlying.findIndex(c => c.columnKey === this.dataSource.columns[l].columnKey)
          if (colIndex > -1) {
            newIndex = colIndex + 1
            break
          }
          l--
        }
        if (r < this.dataSource.columns.length) {
          const colIndex = underlying.findIndex(c => c.columnKey === this.dataSource.columns[r].columnKey)
          if (colIndex > -1) {
            newIndex = colIndex
            break
          }
          r++
        }
      }
      if (newIndex > -1) {
        moveItemInArray(underlying, underlying.findIndex(c => c.columnKey === this.dataSource.columns[columnIndex].columnKey), newIndex)
      }
    }

    this.gridEvents.ColumnsChangedEvent.emit()
  }
}

import { moveItemInArray } from '@angular/cdk/drag-drop'

import { IGridColumn } from '../../typings/interfaces'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class ChangeColumnOrder extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public allColumns(columns: TColumnKey[]) {
    this._columns.sort((a, b) => {
      const aIndex = columns.indexOf(a.columnKey)
      const bIndex = columns.indexOf(b.columnKey)
      return (aIndex === -1 ? 1 : aIndex) - (bIndex === -1 ? 1 : bIndex)
    });
    this.gridEvents.ColumnOrderChangedEvent.emit(this._columns)
  }

  public run(changedIndexes: [number, number]) {
    let   [prevIndex, nextIndex]   = changedIndexes
    let   prevIndexStart: number   = prevIndex
    const indexesChanged: number[] = []
    
    if (prevIndexStart < nextIndex) while (prevIndexStart <= nextIndex) indexesChanged.push(prevIndexStart++)
    else                            while (prevIndexStart >= nextIndex) indexesChanged.push(prevIndexStart--)

    const colsChanged = indexesChanged.map(i => this._columns[i])
    
    moveItemInArray(this.dataSource.columns, changedIndexes[0], changedIndexes[1])

    this.gridEvents.ColumnOrderChangedEvent.emit(colsChanged)
  }

  private get _columns(): IGridColumn[] {
    return this.dataSource.columns
  }

}

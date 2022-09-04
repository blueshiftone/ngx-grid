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

    this.gridEvents.ColumnsChangedEvent.emit()
  }

}

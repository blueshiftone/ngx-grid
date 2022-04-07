import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class ClearCellDraftValue extends Operation {
  public bufferOperation = new BufferOperation(async (args: any) => await this._run(args))
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public buffer = (coordinates: IGridCellCoordinates) => this.bufferOperation.next([coordinates])
  
  private async _run(args: [IGridCellCoordinates][]): Promise<void> {

    const rowKeys = new Set<TPrimaryKey>()
    const promises = new Set<Promise<void>>()

    for (const arg of args) {

      const [coordinates] = arg
      const {rowKey} = coordinates

      rowKeys.add(rowKey)

      const cellValue = this.cellOperations.GetCellValue.run(coordinates)
      if (!cellValue) return
      cellValue.isDraft = false
      this.gridEvents.CellDraftValueChangedEvent.emit(cellValue)
    }

    for (const key of rowKeys) promises.add(this.rowOperations.ResetRowStatus.buffer(key))
    await Promise.all(promises)

    this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}


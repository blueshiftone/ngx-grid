import { ERowStatus } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { WithDefaultTrue } from '../../utils/with-default'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class SetCellDraftValue extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public buffer = (coordinates: IGridCellCoordinates, options: ISetCellDraftValueOptions = {}) => this.bufferOperation.next([coordinates, options])
  
  private async _run(args: [IGridCellCoordinates, ISetCellDraftValueOptions][]): Promise<void> {

    const rowKeys  = new Set<TPrimaryKey>()
    const promises = new Set<Promise<void>>()

    let emitEvent = false

    for (const arg of args) {

      const [coordinates, options] = arg
      const { rowKey } = coordinates

      if (WithDefaultTrue(options.emitEvent)) emitEvent = true

      rowKeys.add(rowKey)

      const cellValue = this.cellOperations.GetCellValue.run(coordinates)
      if (!cellValue) continue;

      cellValue.isDraft = true

      this.gridEvents.CellDraftValueChangedEvent.emit(cellValue)
    }

    for (const key of rowKeys) {
      const rowIsNew = this.rowOperations.GetRowStatus.run(key) === ERowStatus.New
      if (!rowIsNew) {
        promises.add(this.rowOperations.ResetRowStatus.buffer(key))
      }
    }

    await Promise.all(promises)

    if (emitEvent) this.gridEvents.GridWasModifiedEvent.emit(true)
  }

}

export interface ISetCellDraftValueOptions {
  emitEvent?: boolean
}

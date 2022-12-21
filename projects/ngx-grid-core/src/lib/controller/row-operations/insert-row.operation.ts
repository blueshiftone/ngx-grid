import { IGridRow, IRowOperationFactory } from '../../typings/interfaces'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { WithDefaultTrue } from '../../utils/with-default'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'


export class InsertRow extends Operation {

  public bufferOperation = new BufferOperation((args: any) => this._run(args))

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public buffer = (
    insertRow: IGridRow,
    options  : IInsertRowOperationOptions = {}
  ) => this.bufferOperation.next([insertRow, options ])

  private async _run(args: [IGridRow, IInsertRowOperationOptions][]): Promise<void> {

    for (const arg of args) {
      
      let [insertRow, options] = arg

      if (this.dataSource.rowExists(insertRow.rowKey)) continue

      options.increment = Math.max(0, Math.min(options.increment ?? 0, 1))
      
      const globalIndex = options.referenceRow ? this.rowOperations.GetIndexOfRow.run(options.referenceRow) + options.increment : 0

      this.rowOperations.AddRow.buffer(insertRow, globalIndex).then(() => {
        for (const col of this.dataSource.columns) {
          const coords = new GridCellCoordinates(insertRow.rowKey, col.columnKey)
          this.cellOperations.ValidateCell.run(coords)
        }
      })

      if (WithDefaultTrue(options.emitEvent) === true) {
        this.gridEvents.RowInsertedEvent.emit(insertRow)
      }

    }
  }

}

export interface IInsertRowOperationOptions {
  referenceRow?: IGridRow,
  increment?   : number,
  emitEvent?   : boolean
}

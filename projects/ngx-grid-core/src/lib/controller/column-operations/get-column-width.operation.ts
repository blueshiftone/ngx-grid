import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetColumnWidth extends Operation {

  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run (columnKey: TColumnKey): number | null {
    return this._getWidths()?.columns.find(col => col.columnKey === columnKey)?.width ?? null
  }

  private _getWidths() {
    return this.gridEvents.ColumnWidthChangedEvent.state
  }

}

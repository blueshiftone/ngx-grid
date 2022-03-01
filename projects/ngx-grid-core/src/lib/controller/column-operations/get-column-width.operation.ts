import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TColumnKey } from '../../typings/types'
import { BaseColumnOperation } from './base-column-operation.abstract'

export class GetColumnWidth extends BaseColumnOperation {

  constructor(factory: IColumnOperationFactory) { super(factory) }

  public run (columnKey: TColumnKey): number | null {
    return this._getWidths()?.columns.find(col => col.columnKey === columnKey)?.width ?? null
  }

  private _getWidths() {
    return this.gridEvents.ColumnWidthChangedEvent.state
  }

}

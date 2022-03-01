import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetThemeMode extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run() { return this._themeMode }

  private get _themeMode() {
    return this.gridEvents.GridUIThemeChangedEvent.state ?? 'light'
  }

}

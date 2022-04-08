import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetThemeMode extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run() { return this._themeMode }

  private get _themeMode() {
    return this.gridEvents.GridUIThemeChangedEvent.state ?? 'light'
  }

}

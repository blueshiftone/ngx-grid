import { IGridOperationFactory } from '../../typings/interfaces'
import { Operation } from '../operation.abstract'

export class GetGridElementSizes extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  private _defaultRowHeight: number = 25
  private _defaultThumbWidth: number = 22

  public getRowHeight(): number {
    return this.controller.gridEvents.GridThemeChangedEvent.state?.rowHeight ?? this._defaultRowHeight
  }

  public getThumbWidth(): number {
    return this.controller.gridEvents.GridThemeChangedEvent.state?.thumbWidth ?? this._defaultThumbWidth
  }

}

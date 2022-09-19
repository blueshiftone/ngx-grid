import { BehaviorSubject } from 'rxjs'

import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GridTopLeftCornerActions extends Operation {

  private _actionsStack: {key: string, actions: IGridCornerAction[]}[] = []

  private _actionsSet = new Set<string>()

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public add(key: string, actions: IGridCornerAction[]) {    
    if (this._actionsSet.has(key)) this.remove(key, false)
    this._actionsStack.push({key, actions})
    this._actionsSet.add(key)
    this.gridEvents.GridTopLeftCornerActionsChangedEvent.emit(actions)
  }

  public remove(key: string, emit = true) {
    this._actionsStack = this._actionsStack.filter(x => x.key !== key)
    if (emit) {
      this.gridEvents.GridTopLeftCornerActionsChangedEvent.emit(this._actionsStack[this._actionsStack.length - 1]?.actions ?? null)
    }
  }

}

export interface IGridCornerAction {
  icon: BehaviorSubject<string>
  tooltip: BehaviorSubject<string>
  onClick: () => void
}

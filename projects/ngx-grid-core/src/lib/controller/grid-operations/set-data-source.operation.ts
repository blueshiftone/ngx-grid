import { Subscription } from 'rxjs'
import { take } from 'rxjs/operators'

import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class SetDataSource extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }
  
  private _watchSource?  : Subscription
  
  public run(source: IGridDataSource): void {
    this.onDestroy()
    source.data.pipe(take(1)).subscribe(_ => this.gridOperations.SetGridFocus.run())
    this._watchSource = source.data.subscribe(_ => {
      this.rowOperations.UpdateRowMap.run(source)  
      this.gridEvents.GridInitialisedEvent.emit(false)
      this.gridEvents.GridDataChangedEvent.emit(source)
      this.gridOperations.UpdateRelatedDataMap.run()
    })
  }

  public override onDestroy = () => this._watchSource?.unsubscribe()
}

import { SubscriptionLike } from 'rxjs'
import { take } from 'rxjs/operators'

import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class SetDataSource extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }
  
  private _subs = new Set<SubscriptionLike>()
  
  public run(source: IGridDataSource): void {
    this.onDestroy()
    source.data.pipe(take(1)).subscribe(_ => this.gridOperations.SetGridFocus.run())
    this._subs.add(source.data.subscribe(_ => {
      this.rowOperations.UpdateRowMap.run(source)  
      this.gridEvents.GridInitialisedEvent.emit(false)
      this.gridEvents.GridDataChangedEvent.emit(source)
    }))
    
    this.gridOperations.UpdateRelatedDataMap.run()

    for (const relatedSource of source.relatedData.entries()) {
      this._subs.add(relatedSource[1].data.subscribe(_ => {
        this.gridOperations.UpdateRelatedDataMap.run([relatedSource])
        this.gridOperations.UpdateForeignKeyCells.run(relatedSource[0])
      }))
    }
    
  }

  public override onDestroy = () => {
    this._subs.forEach(s => s.unsubscribe())
    this._subs.clear()
  }
}

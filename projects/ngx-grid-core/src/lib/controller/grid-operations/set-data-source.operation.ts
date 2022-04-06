import { SubscriptionLike } from 'rxjs'
import { take } from 'rxjs/operators'

import { GridDataSource } from '../../grid-data-source'
import { EMetadataType } from '../../typings/enums'
import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from '../../typings/types'
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
      this._watchRelatedDataSource(...relatedSource)
    }
    
  }

  public getRelatedGrid(dataSetName: string, dataGridID: string, primaryColumnKey: TColumnKey, recordPreviewTemplateString: string): IGridDataSource {
    let relatedGrid = this.gridOperations.GetRelatedData.run(dataGridID)
    if (!relatedGrid) {
      relatedGrid = new GridDataSource({
        dataSetName,
        dataGridID,
        primaryColumnKey,
        metadata: GridImplementationFactory.gridMetadataCollection([ { key: EMetadataType.RecordPreviewTemplateString, value: recordPreviewTemplateString } ])
      })
      this.gridOperations.SetRelatedData.run(dataGridID, relatedGrid)
      this._watchRelatedDataSource(dataGridID, relatedGrid)
    }
    return relatedGrid
  }

  public override onDestroy = () => {
    this._subs.forEach(s => s.unsubscribe())
    this._subs.clear()
  }

  private _watchRelatedDataSource(sourceGridID: string, source: IGridDataSource): void {
    this._subs.add(source.data.subscribe(_ => {
      this.gridOperations.UpdateRelatedDataMap.run([[sourceGridID, source]])
      this.gridOperations.UpdateForeignKeyCells.run(sourceGridID)
    }))
  }
}

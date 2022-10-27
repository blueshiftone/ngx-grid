import { SubscriptionLike } from 'rxjs'
import { map, pairwise, startWith } from 'rxjs/operators'

import { GridDataSource } from '../../grid-data-source'
import { EMetadataType } from '../../typings/enums'
import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class SetDataSource extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }
  
  private _subs = new Set<SubscriptionLike>()
  
  public run(source: IGridDataSource): void {

    this.onDestroy()

    this.gridOperations.gridController.dataSource.onDestroy()

    this.gridOperations.gridController.dataSource = source

    this._subs.add(source.onChanges.pipe(
      map(_ => source.rows),
      startWith(null),
      pairwise()).subscribe(e => {
        const [ prevRows, nextRows ] = e
        if (!prevRows?.latestValue?.length && nextRows?.latestValue?.length) {
          this.columnOperations.InitialiseColumnWidth.reset()
        }
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
      this.gridEvents.RelatedGridAddedEvent.emit(relatedGrid)
    }
    return relatedGrid
  }

  public override onDestroy = () => {
    this.dataSource.onDestroy()
    this._subs.forEach(s => s.unsubscribe())
    this._subs.clear()
  }

  private _watchRelatedDataSource(sourceGridID: string, source: IGridDataSource): void {
    this._subs.add(source.onChanges.subscribe(_ => {
      this.gridOperations.UpdateRelatedDataMap.run([[sourceGridID, source]])
      this.gridOperations.UpdateForeignKeyCells.run(sourceGridID)
    }))
  }
}

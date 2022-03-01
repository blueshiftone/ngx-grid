import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'

import { IGridDataSource, IGridViewportAutoScrollConfigs } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { TGridOperations, TRelatedDataMap } from '../../controller/grid-operations/_grid-operation.factory'
import { IGridEventsFactory } from '../../events/grid-events.service'

export interface IGridOperationFactory extends TGridOperations {
  gridEvents    : IGridEventsFactory
  gridController: GridControllerService
  viewPort?     : CdkVirtualScrollViewport
  relatedDataMap: TRelatedDataMap
  
  attachViewport(viewPort: CdkVirtualScrollViewport, configs: IGridViewportAutoScrollConfigs): void
  source   (): IGridDataSource
  onDestroy(): void
}

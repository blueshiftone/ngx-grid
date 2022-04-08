import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'

import { IGridViewportAutoScrollConfigs } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { TGridOperations, TRelatedDataMap } from '../../controller/grid-operations/_grid-operation.factory'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { IDestroyable } from './destroyable.interface'

export interface IGridOperationFactory extends TGridOperations, IDestroyable {
  gridEvents    : IGridEventsFactory
  gridController: GridControllerService
  viewPort?     : CdkVirtualScrollViewport
  relatedDataMap: TRelatedDataMap
  
  attachViewport(viewPort: CdkVirtualScrollViewport, configs: IGridViewportAutoScrollConfigs): void
}

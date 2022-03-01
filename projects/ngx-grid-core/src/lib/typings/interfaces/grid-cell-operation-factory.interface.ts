import { TCellOperations } from '../../controller/cell-operations/_cell-operation.factory'
import { GridControllerService } from '../../controller/grid-controller.service'
import { IGridEventsFactory } from '../../events/grid-events.service'

export interface ICellOperationFactory extends TCellOperations {
  gridEvents    : IGridEventsFactory
  gridController: GridControllerService
  
  clearSelection(): void
  onDestroy     (): void
}

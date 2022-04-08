import { TCellOperations } from '../../controller/cell-operations/_cell-operation.factory'
import { GridControllerService } from '../../controller/grid-controller.service'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { IDestroyable } from './destroyable.interface'

export interface ICellOperationFactory extends TCellOperations, IDestroyable {
  gridEvents    : IGridEventsFactory
  gridController: GridControllerService
  
  clearSelection(): void
}

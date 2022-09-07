import { IGridRow } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { TRowOperations } from '../../controller/row-operations/_row-operation.factory'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { TPrimaryKey } from '../types'
import { IDestroyable } from './destroyable.interface'


export interface IRowOperationFactory extends TRowOperations, IDestroyable {
  gridEvents      : IGridEventsFactory
  gridController  : GridControllerService
  dirtyRowsMap    : Map<TPrimaryKey, IGridRow>
  clearSelection(): void
}

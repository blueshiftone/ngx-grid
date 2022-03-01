import { IGridRow, IGridRowMeta } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { TRowOperations } from '../../controller/row-operations/_row-operation.factory'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { TPrimaryKey } from '../types'


export interface IRowOperationFactory extends TRowOperations {
  gridEvents      : IGridEventsFactory
  gridController  : GridControllerService
  rowKeyMap       : Map<TPrimaryKey, IGridRow>
  dirtyRowsMap    : Map<TPrimaryKey, IGridRowMeta>
  clearSelection(): void
  onDestroy     (): void
}

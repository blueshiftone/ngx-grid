import { TColumnOperations } from '../../controller/column-operations/_column-operation.factory'
import { GridControllerService } from '../../controller/grid-controller.service'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { LocalPreferencesService } from '../../services/local-preferences.service'
import { IDestroyable } from './destroyable.interface'

export interface IColumnOperationFactory extends TColumnOperations, IDestroyable {
  gridEvents    : IGridEventsFactory
  gridController: GridControllerService
  prefsService  : LocalPreferencesService
  
  getPrefsKey(k: string): string
}

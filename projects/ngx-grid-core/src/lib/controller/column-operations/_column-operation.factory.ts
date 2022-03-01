import * as columnOperations from '.'
import { LocalPreferencesService } from '../../services/local-preferences.service'
import { IColumnOperationFactory } from '../../typings/interfaces/grid-column-operation-factory.interface'
import { TInstanceTypeProps } from '../../typings/types'
import { GridControllerService } from '../grid-controller.service'

export type TColumnOperations = TInstanceTypeProps<typeof columnOperations>

export class ColumnOperationFactory {
  
  public factory            : IColumnOperationFactory
  public readonly operations: TColumnOperations

  constructor(
    gridController: GridControllerService,
    prefsService  : LocalPreferencesService
  ) {
    const  { gridEvents } = gridController

    this.factory = {
      gridEvents,
      prefsService,
      gridController,
      getPrefsKey: (k: string) => `${k}>${gridController.grid.GetGridId.run() ?? ''}`,
      onDestroy: () => Object.values(this.operations).forEach(itm => itm.onDestroy?.()),
    } as IColumnOperationFactory

    this.operations = {} as TColumnOperations
    for (const key of (Object.keys(columnOperations) as (keyof typeof columnOperations)[])) this.operations[key] = new columnOperations[key](this.factory) as any
    Object.assign(this.factory, this.operations)

  }

}

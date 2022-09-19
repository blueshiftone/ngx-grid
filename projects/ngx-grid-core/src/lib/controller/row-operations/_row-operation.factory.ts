import * as RowOperations from '.'
import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TInstanceTypeProps, TPrimaryKey } from '../../typings/types'
import { GridControllerService } from '../grid-controller.service'

export type TRowOperations = TInstanceTypeProps<typeof RowOperations>

export class RowOperationFactory {

  public readonly dirtyRowsMap = new Map<TPrimaryKey, IGridRow>()
  
  public readonly operations: TRowOperations
  public readonly factory   : IRowOperationFactory

  constructor(gridController: GridControllerService) {
    const { dirtyRowsMap } = this

    this.factory = {
      dirtyRowsMap,
      gridController,
      gridEvents: gridController.gridEvents,
      clearSelection: () => {
        const rowComponents = this.factory.RowComponents.getAll()
        this.factory.SetRowSelectionClasses.clear(rowComponents)
        this.factory.SetRowFocusedClasses.clear(rowComponents)
        this.factory.CheckRowIcon.clear(rowComponents)
      },
      onDestroy: () => Object.values(this.operations).forEach(itm => itm.onDestroy?.())
    } as IRowOperationFactory

    this.operations = {} as TRowOperations
    for (const key of (Object.keys(RowOperations) as (keyof typeof RowOperations)[])) this.operations[key] = new RowOperations[key](this.factory) as any
    Object.assign(this.factory, this.operations)

  }

}

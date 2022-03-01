import * as cellOperations from '.'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { TInstanceTypeProps } from '../../typings/types'
import { GridControllerService } from '../grid-controller.service'

export type TCellOperations = TInstanceTypeProps<typeof cellOperations>

export class CellOperationFactory {
  
  public factory            : ICellOperationFactory 
  public readonly operations: TCellOperations
  
  constructor(gridController: GridControllerService) {
    const { gridEvents } = gridController

    this.factory = {
      gridEvents,
      gridController,
      onDestroy: () => Object.values(this.operations).forEach(itm => itm.onDestroy?.()),
      clearSelection: () => {
        const cells = this.operations.CellComponents.getAll()
        this.operations.SetCellSelectionClasses.clear(cells)
        this.operations.SetFocusedCellClasses.clear(cells)
      }
    } as ICellOperationFactory

    this.operations = {} as TCellOperations
    for (const key of (Object.keys(cellOperations) as (keyof typeof cellOperations)[])) this.operations[key] = new cellOperations[key](this.factory) as any
    Object.assign(this.factory, this.operations)

  }

}

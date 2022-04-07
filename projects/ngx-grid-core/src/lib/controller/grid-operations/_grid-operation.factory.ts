import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'

import * as GridOperations from '.'
import { IGridDataSource, IGridRow, IGridViewportAutoScrollConfigs } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TInstanceTypeProps, TPrimaryKey } from '../../typings/types'
import { GridControllerService } from '../grid-controller.service'

export type TGridOperations = TInstanceTypeProps<typeof GridOperations>

export class GridOperationFactory {

  public relatedDataMap     : TRelatedDataMap = new Map()

  public readonly operations: TGridOperations
  public readonly factory   : IGridOperationFactory

  constructor(gridController: GridControllerService) {
    const { relatedDataMap } = this
    const { gridEvents }     = gridController

    this.factory = {
      relatedDataMap,
      gridController,
      gridEvents,
      attachViewport: (viewPort: CdkVirtualScrollViewport, configs: IGridViewportAutoScrollConfigs) => {
        this.factory.viewPort = viewPort
        this.operations.ViewportAutoScroll.run(configs)
        this.operations.ViewportWatchScrollOffset.run()
        this.operations.ViewportSetupEditTriggers.run()
        this.operations.KeyBindings.run()
      },
      onDestroy: () => Object.values(this.operations).forEach(itm => itm.onDestroy?.()),
    } as IGridOperationFactory

    this.operations = {} as TGridOperations
    for (const key of (Object.keys(GridOperations) as (keyof typeof GridOperations)[])) this.operations[key] = new GridOperations[key](this.factory) as any
    Object.assign(this.factory, this.operations)
  }

}

export type TRelatedDataMap = Map<string, { source: IGridDataSource, rowMap: Map<TPrimaryKey, IGridRow> }>

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Subscription, SubscriptionLike } from 'rxjs'

import { ISelectionController } from '../../typings/interfaces'
import { IDestroyable } from '../../typings/interfaces/destroyable.interface'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TInstanceTypeProps } from '../../typings/types'
import { GridControllerService } from '../grid-controller.service'
import * as SelectionOperations from './operations'
import { TSelectionStrategies } from './strategies'

export type TSelectionOperations = TInstanceTypeProps<typeof SelectionOperations>

export class GridSelectionController implements IDestroyable {

  public readonly operations: TSelectionOperations
  public readonly factory   : ISelectionController

  private _subscriptions = new Set<SubscriptionLike>()
  private _gridViewPort?: CdkVirtualScrollViewport

  constructor(
    public readonly gridController: GridControllerService,
    public readonly rowOperations : IRowOperationFactory
  ) {

    this.factory = {
      state          : null,
      gridEvents     : gridController.gridEvents,
      keyboardEvents : {},
      gridController,

      pageSize: () => Math.floor((this._gridViewPort?.getViewportSize() || 0) / 25),

      onDestroy: () => this.onDestroy(),

      addSubscription: (s: Subscription) => this._subscriptions.add(s),

      latestSelection: () => this.gridController.gridEvents.CellSelectionChangedEvent.state,

      attachGridBody: (viewPort: CdkVirtualScrollViewport) => {
        this._gridViewPort = viewPort
        this.factory.strategy?.attach(viewPort.elementRef.nativeElement)
      },

      initialise: (strategy: TSelectionStrategies) => {
        this.onDestroy()
        this.factory.strategy = new strategy(this.factory)
        if (this._gridViewPort) this.factory.attachGridBody(this._gridViewPort)

        this._subscriptions.add(this.gridController.gridEvents.GridKeyCmdPressedEvent.on().subscribe(e => {
          switch(e?.key) {
            case 'ArrowUp'   : this.factory.keyboardEvents.arrowUp?.(e); break
            case 'ArrowRight': this.factory.keyboardEvents.arrowRight?.(e); break
            case 'ArrowDown' : this.factory.keyboardEvents.arrowDown?.(e); break
            case 'ArrowLeft' : this.factory.keyboardEvents.arrowLeft?.(e); break
            case 'PageUp'    : this.factory.keyboardEvents.pageUp?.(e); break
            case 'PageDown'  : this.factory.keyboardEvents.pageDown?.(e); break
            case 'Home'      : this.factory.keyboardEvents.home?.(e); break
            case 'End'       : this.factory.keyboardEvents.end?.(e); break
            case 'Ctrl+A'    : this.factory.keyboardEvents.ctrlA?.(e); break
            case 'Tab'       : this.factory.keyboardEvents.tab?.(e); break
            case 'Enter'     : this.factory.keyboardEvents.enter?.(e); break
            case 'Space'     : this.factory.keyboardEvents.space?.(e); break
          }
          if (e) this.factory.keyboardEvents.any?.(e);
        }))
      }

    } as ISelectionController

    this.operations = {} as TSelectionOperations
    for (const key of (Object.keys(SelectionOperations) as (keyof typeof SelectionOperations)[])) this.operations[key] = new SelectionOperations[key](this.factory) as any
    Object.assign(this.factory, this.operations)

  }

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

}

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { SubscriptionLike } from 'rxjs'

import { GridControllerService } from '../../controller/grid-controller.service'
import { TSelectionOperations } from '../../controller/selection/grid-selection.controller'
import { TSelectionStrategies } from '../../controller/selection/strategies'
import { IGridEventsFactory } from '../../events/grid-events.service'
import { IDestroyable } from './destroyable.interface'
import { IGridKeyboardEvent } from './grid-keyboard-event.interface'
import { IGridSelectionRange } from './grid-selection-range.interface'
import { IGridSelectionState } from './grid-selection-state.interface'
import { IGridSelectionStrategy } from './grid-selection-strategy.interface'

export interface ISelectionController extends TSelectionOperations, IDestroyable {
  gridEvents     : IGridEventsFactory
  gridController : GridControllerService
  state          : IGridSelectionState | null
  strategy?      : IGridSelectionStrategy
  pageSize       : () => number
  initialise     : (strategy: TSelectionStrategies) => void
  attachGridBody : (viewPort: CdkVirtualScrollViewport) => void
  latestSelection: () => IGridSelectionRange | null | undefined
  addSubscription: (s: SubscriptionLike) => Set<SubscriptionLike>
  keyboardEvents : {
    arrowUp?   (e: IGridKeyboardEvent): void;
    arrowRight?(e: IGridKeyboardEvent): void;
    arrowDown? (e: IGridKeyboardEvent): void;
    arrowLeft? (e: IGridKeyboardEvent): void;
    pageUp?    (e: IGridKeyboardEvent): void;
    pageDown?  (e: IGridKeyboardEvent): void;
    home?      (e: IGridKeyboardEvent): void;
    end?       (e: IGridKeyboardEvent): void;
    ctrlA?     (e: IGridKeyboardEvent): void;
    tab?       (e: IGridKeyboardEvent): void;
    enter?     (e: IGridKeyboardEvent): void;
    space?     (e: IGridKeyboardEvent): void;
    any?       (e: IGridKeyboardEvent): void;
  }
}

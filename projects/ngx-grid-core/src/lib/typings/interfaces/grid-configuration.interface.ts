import { BehaviorSubject } from 'rxjs'

import { TSelectionStrategyName } from '../../controller/selection/strategies'

export interface IGridConfiguration {
  uiTheme            : BehaviorSubject<TGridUITheme>
  gridMode           : TGridMode
  selectionStrategy  : TSelectionStrategyName
  scrollToPreselected: boolean
  maskNewIds         : boolean
}

export type TGridMode    = 'Standard' | 'SelectMode'
export type TGridUITheme = 'light' | 'dark'

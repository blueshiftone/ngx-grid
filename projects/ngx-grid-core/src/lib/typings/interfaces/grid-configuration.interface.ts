import { BehaviorSubject } from 'rxjs'

import { TSelectionStrategyName } from '../../controller/selection/strategies'
import { INgxGridTheme } from '../../ui/themes/ngx-grid-theme.interface'

export interface IGridConfiguration {
  uiTheme            : BehaviorSubject<TGridUITheme>
  gridTheme          : BehaviorSubject<INgxGridTheme>
  gridMode           : TGridMode
  selectionStrategy  : TSelectionStrategyName
  scrollToPreselected: boolean
  maskNewIds         : boolean
}

export type TGridMode    = 'Standard' | 'SelectMode'
export type TGridUITheme = 'light' | 'dark'

import { BehaviorSubject } from 'rxjs'

import { TSelectionStrategyName } from './controller/selection/strategies'
import { IGridConfiguration, TGridMode, TGridUITheme } from './typings/interfaces'
import { INgxGridTheme } from './ui/themes/ngx-grid-theme.interface'
import { DefaultTheme } from './ui/themes/default.theme'

export class DataGridConfigs implements IGridConfiguration {
  public uiTheme                                     = new BehaviorSubject<TGridUITheme>('light')
  public gridMode           : TGridMode              = 'Standard'
  public selectionStrategy  : TSelectionStrategyName = 'Standard'
  public scrollToPreselected: boolean                = true
  public maskNewIds         : boolean                = false
  public gridTheme          : BehaviorSubject<INgxGridTheme> = new BehaviorSubject<INgxGridTheme>(DefaultTheme)

  constructor() {}

  public withGridTheme(theme: INgxGridTheme) {
    this.gridTheme.next(theme)
    return this
  }

  public withConfigs(input: Partial<IGridConfiguration>) {
    Object.assign(this, input)
    return this
  }

  public withDarkMode() {
    this.uiTheme.next('dark')
    return this
  }

  public withLightMode() {
    this.uiTheme.next('light')
    return this
  }

  public withSelectMode() {
    this.gridMode = 'SelectMode'
    return this
  }

  public withRowMultiSelect() {
    this.selectionStrategy = 'MultiRow'
    return this.withSelectMode()
  }

  public withRowSingleSelect() {
    this.selectionStrategy = 'SingleRow'
    return this.withSelectMode()
  }

}

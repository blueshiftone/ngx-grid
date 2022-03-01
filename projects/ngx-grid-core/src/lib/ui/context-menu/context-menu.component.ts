import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

import { EGridIcon } from '../../services/icon.service'
import { IGridContextMenuItem } from '../../typings/interfaces/grid-context-menu-item.interface'

@Component({
  selector: 'data-grid-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {

  @Input() public items: IGridContextMenuItem[] = []

  constructor() { }

  public iconValue(value: EGridIcon) {
    return Object.keys(EGridIcon)[Object.values(EGridIcon).indexOf(value)]
  }

}

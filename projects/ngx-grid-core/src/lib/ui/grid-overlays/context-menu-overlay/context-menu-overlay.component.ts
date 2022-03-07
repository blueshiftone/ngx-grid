import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core'

import { GRID_CONTEXT_MENU } from '../../../services/grid-context-menu.service'
import { IGridContextMenu } from '../../../typings/interfaces/grid-context-menu.interface'

@Component({
  selector: 'data-grid-context-menu-overlay',
  templateUrl: './context-menu-overlay.component.html',
  styleUrls: ['./context-menu-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuOverlayComponent {

  @HostListener('contextmenu', ['$event'])
  public onContextMenu(e: MouseEvent) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  constructor(
    @Inject(GRID_CONTEXT_MENU) public menu: IGridContextMenu,
  ) { }

}

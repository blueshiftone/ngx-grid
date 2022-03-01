import { Directive, HostListener, Input } from '@angular/core'

import { GridContextMenuService } from '../../services/grid-context-menu.service'
import { IGridContextMenuItem } from '../../typings/interfaces/grid-context-menu-item.interface'

@Directive({
  selector: '[dataGridContextMenu]'
})
export class ContextMenuDirective {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() public dataGridContextMenu?: () => IGridContextMenuItem[]

  @HostListener('contextmenu', ['$event'])
  public onClick(e: MouseEvent) {
    if (!this.dataGridContextMenu) return
    e.preventDefault()
    const items = this.dataGridContextMenu()
    this.ctxService.open(e, items)
  }

  constructor(
    private readonly ctxService: GridContextMenuService
  ) { }

}

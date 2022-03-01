import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../services/grid-overlay-service.service'
import { IGridOverlayData } from '../../typings/interfaces'
import { BaseOverlayComponent } from './base-grid-overlay.component'

@Component({
  template: ''
})
export class BasePreviewComponent extends BaseOverlayComponent implements OnInit {

  @HostListener('contextmenu', ['$event'])
  public onClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    e.preventDefault()
    this.cell.displayNode.dispatchEvent(new MouseEvent("contextmenu", e))
  }

  constructor(
    @Inject(GRID_OVERLAY_DATA) data: IGridOverlayData,
    cd: ChangeDetectorRef,
  ) { super(data, cd) }

}

import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core'
import { merge } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { IGridRow } from '../../../typings/interfaces'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'

@Component({
  selector: 'lib-row-floating-title',
  templateUrl: './row-floating-title.component.html',
  styleUrls: ['./row-floating-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowFloatingTitleComponent extends AutoUnsubscribe implements OnInit {

  @Input() public row?: IGridRow

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly controller: GridControllerService
  ) { super() }

  private _lastSeenWidth?: string

  @HostListener('click')
  onClick() {
    this.row?.floatingTitle?.action(this.row)
  }

  ngOnInit(): void {
    const events = this.controller.grid.gridEvents
    const dataSource = this.controller.dataSource
    this.addSubscription(merge(events.ColumnWidthChangedEvent.onWithInitialValue(), events.ColumnsChangedEvent.on()).subscribe(() => {
      const firstColumnKey = dataSource.columns[0].columnKey
      const width = events.ColumnWidthChangedEvent.state?.getWidth(firstColumnKey) ?? null
      if (width) {
        const widthPx = `${width - 1}px`
        if (widthPx !== this._lastSeenWidth) {
          this.el.nativeElement.style.width = widthPx
          this._lastSeenWidth = widthPx
        }
      }
    }))
  }

}

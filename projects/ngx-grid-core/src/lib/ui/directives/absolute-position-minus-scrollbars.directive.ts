import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { fromEvent, merge, Observable, SubscriptionLike } from 'rxjs'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'

@Directive({
  selector: '[libAbsolutePositionMinusScrollbars]'
})
export class BottomPlusScrollbarDirective implements OnInit, OnDestroy {

  @Input() public changes?: Observable<any>
  @Input() public viewport?: CdkVirtualScrollViewport

  private _subs = new Set<SubscriptionLike>()

  constructor(
    private readonly _el: ElementRef,
    private events: GridEventsService,
    private readonly controller: GridControllerService,
  ) {}

  ngOnInit(): void {
    this.update()
    if (this.changes) {
      this._subs.add(merge(
        this.changes,
        this.events.factory.GridDataChangedEvent.on(),
        this.events.factory.ColumnWidthChangedEvent.on(),
        fromEvent(window, 'resize')
      ).subscribe(_ => {
        window.requestAnimationFrame(() => this.update())
      }))
    }
  }

  private update(): void {
    const viewportEl = this.viewport?.elementRef.nativeElement
    if (!viewportEl) return
    const verticalScrollbarSize = viewportEl.offsetHeight - viewportEl.clientHeight
    const horizontalScrollbarSize = viewportEl.offsetWidth - viewportEl.clientWidth
    const { style } = this._el.nativeElement
    style.bottom = `${verticalScrollbarSize}px`
    style.right = `${horizontalScrollbarSize}px`
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe())
  }

}

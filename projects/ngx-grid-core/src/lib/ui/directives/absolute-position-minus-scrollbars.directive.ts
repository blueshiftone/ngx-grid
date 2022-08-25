import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { Observable, SubscriptionLike } from 'rxjs'

@Directive({
  selector: '[libAbsolutePositionMinusScrollbars]'
})
export class BottomPlusScrollbarDirective implements OnInit, OnDestroy {

  @Input() public changes?: Observable<any>
  @Input() public viewport?: CdkVirtualScrollViewport

  private _subs = new Set<SubscriptionLike>()

  constructor(
    private readonly _el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.update()
    if (this.changes) {
      this._subs.add(this.changes.subscribe(_ => {
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

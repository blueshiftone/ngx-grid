import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core'
import { Subject, Subscription } from 'rxjs'

@Directive({
  selector: '[dataGridKeepVisible]'
})
export class KeepVisibleDirective implements OnInit, OnDestroy {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  @Input() public dataGridKeepVisible: Subject<HTMLElement> = new Subject
  @Input() public scrollPadding: [number, number] = [10, 10]

  private _subscriptions = new Set<Subscription>()

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this._subscriptions.add(this.dataGridKeepVisible.subscribe(el => {
      this._run(el)
    }))
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  private _run(childElement: HTMLElement): void {

    const topScrollOffset     = this._scrollElement.scrollTop
    const viewportHeight      = this._scrollElement.clientHeight
    const viewportTopBound    = topScrollOffset
    const viewportBottomBound = topScrollOffset + viewportHeight
    const cellHeight          = childElement.clientHeight
    const cellTopBound        = childElement.offsetTop
    const cellBottomBound     = cellTopBound + cellHeight
    const cellClippedTop      = cellTopBound - this.scrollPadding[0] < viewportTopBound
    const cellClippedBottom   = cellBottomBound + this.scrollPadding[1] > viewportBottomBound
    
    const bounds = {
      clippedTop    : cellClippedTop,
      clippedBottom : cellClippedBottom,
      isClipped     : cellClippedTop || cellClippedBottom,
      isFullyVisible: !cellClippedTop && !cellClippedBottom,
    }

    if (!bounds.isFullyVisible) {
      if (bounds.clippedBottom) {
        this._scrollElement.scrollTo({
          top: cellTopBound - viewportHeight + cellHeight + this.scrollPadding[1]
        })
      }
      else if (bounds.clippedTop) {
        this._scrollElement.scrollTo({
          top: cellTopBound - this.scrollPadding[0]
        })
      }
    }
  }

  private get _scrollElement() { return this.elRef.nativeElement }

}

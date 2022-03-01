import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core'
import { fromEvent, merge, Subject } from 'rxjs'
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators'

import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'
import { WINDOW } from '../../../utils/window'

@Component({
  selector: 'app-resizer',
  template: '',
  styleUrls: ['./resizer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizerComponent extends AutoUnsubscribe implements OnInit {

  @Input() public edge: 'Top' | 'Right' | 'Bottom' | 'Left' | 'CornerBR' | 'CornerBL' | 'CornerTL' = 'Right'

  @Output() public output      = new EventEmitter<{ x: number, y: number }>()
  @Output() public resizeStart = new EventEmitter()
  @Output() public resizeEnd   = new EventEmitter()

  constructor(
    private readonly elRef                 : ElementRef<HTMLElement>,
    @Inject(DOCUMENT) private readonly doc : Document,
    @Inject(WINDOW) private readonly window: Window,
  ) { super() }

  ngOnInit(): void {
    if (!this._parentEl) return

    // Add Edge as a css class for styles
    this._el.classList.add(this.edge)

    // Resizer must be positioned relative to the parent
    // So let's ensure our parent is not statically positioned
    if (this._parentIsStatic) this._parentEl.style.position = 'relative'
    this._parentEl.style.overflow = 'visible'

    /* Listen to Mouse and Window events and emit distance moved */
    this.addSubscription(fromEvent(this._docEl, 'mouseup').subscribe(_ => this._mouseReleased.next(true)))
    this.addSubscription(fromEvent<MouseEvent>(this._el, 'mousedown').subscribe(event => {
      event.stopPropagation()
      event.preventDefault() // stops native html element dragging
      this.resizeStart.emit()
      this._setCursor(this._cursor)
      let lastPos = this._mousePosition(event)
      fromEvent<MouseEvent>(this._docEl, 'mousemove').pipe(takeUntil(merge(this._mouseReleased, this._windowFocusChanged))).subscribe(event => {
        const pos = this._mousePosition(event)
        const distanceMoved = { x: 0, y: 0 }
        if (this._isXAxis || this._isDiagonal) distanceMoved.x = pos.x - lastPos.x
        if (this._isYAxis || this._isDiagonal) distanceMoved.y = pos.y - lastPos.y
        this.output.emit(distanceMoved)
        lastPos = pos
      }).add(() => {
        this._resetCursor()
        this.resizeEnd.emit()
      })
    }))

  }

  private _mouseReleased = new Subject<boolean>()
  private _windowFocusChanged = merge(fromEvent(this.window, 'focus'), fromEvent(this.window, 'blur')).pipe(
    map(_ => this.doc.hasFocus()),
    distinctUntilChanged()
  )

  private _resetCursor = () => this._setCursor('')
  private _setCursor(cursor: string): void {
    this.doc.documentElement.style.cursor = cursor
  }

  private _mousePosition = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY })

  private get _axis(): EAxis  {
    if (['Right', 'Left'].includes(this.edge)) return EAxis.X
    if (['Top', 'Bottom'].includes(this.edge)) return EAxis.Y
    if (['CornerTL', 'CornerBR'].includes(this.edge)) return EAxis.DiagonalDescending
    if (['CornerBL', 'CornerTR'].includes(this.edge)) return EAxis.DiagonalAscending
    return EAxis.X
  }

  private get _isXAxis()   : boolean { return this._axis == EAxis.X }
  private get _isYAxis()   : boolean { return this._axis == EAxis.Y }
  private get _isDiagDesc(): boolean { return this._axis == EAxis.DiagonalDescending }
  private get _isDiagAsc (): boolean { return this._axis == EAxis.DiagonalAscending }
  private get _isDiagonal(): boolean { return this._isDiagAsc || this._isDiagDesc }

  private get _cursor(): string {
    if (this._isXAxis)    return 'ew-resize'
    if (this._isYAxis)    return 'ns-resize'
    if (this._isDiagAsc)  return 'sw-resize'
    if (this._isDiagDesc) return 'nw-resize'
    return ''
  }

  private get _docEl()         : HTMLElement        { return this.doc.documentElement }
  private get _el()            : HTMLElement        { return this.elRef.nativeElement }
  private get _parentEl()      : HTMLElement | null { return this._el.parentElement }
  private get _parentIsStatic(): boolean            { return this._parentEl && this.window.getComputedStyle(this._parentEl).position === 'static' || false }

}

enum EAxis {
  X,
  Y,
  DiagonalDescending,
  DiagonalAscending
}

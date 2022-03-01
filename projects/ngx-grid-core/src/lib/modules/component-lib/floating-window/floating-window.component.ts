import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core'
import { from, fromEvent, merge, Subject } from 'rxjs'
import { distinctUntilChanged, filter, map, takeUntil, throttleTime } from 'rxjs/operators'

import { DeleteFromArray } from '../../../utils/array-delete'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'
import { Randomish } from '../../../utils/randomish'
import { WINDOW } from '../../../utils/window'

export const FLOATING_WINDOW_FOCUS_STACK: string[] = []

@Component({
  selector: 'app-floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatingWindowComponent extends AutoUnsubscribe implements OnInit {

  @ViewChild('grabber', {static: true}) public grabber!: ElementRef<HTMLDivElement>
  @ViewChild('wrapper', {static: true}) public wrapper!: ElementRef<HTMLDivElement>

  @Input() public width?: number
  @Input() public height?: number

  @Output() public closed = new EventEmitter()
  @Output() public resized = new EventEmitter()
  
  private _mouseReleased      = new Subject<boolean>()
  private _windowFocusChanged = merge(fromEvent(this.window, 'focus'), fromEvent(this.window, 'blur')).pipe(map(_ => this.doc.hasFocus()), distinctUntilChanged())

  private _translate = { x: 0, y: 0 }

  private _id: string

  private _resizeEmitionRequests = new Subject<void>()

  constructor(
    @Inject(DOCUMENT)   private readonly doc   : Document,
    @Inject(WINDOW)     private readonly window: Window,
    private readonly elRef: ElementRef<HTMLElement>
  ) {
    super()
    this._id = Randomish()
    this._updateFocusStack()
  }

  ngOnInit(): void {

    if (this.width && this.width > 0) this._wrapperStyle.width = `${this.width}px`

    const disablePointerEvents = (el: HTMLElement) => {
      el.style.pointerEvents = 'none'
      if (el.classList.contains('cdk-overlay-pane') || !el.parentElement) return
      disablePointerEvents(el.parentElement)
    }
    disablePointerEvents(this.elRef.nativeElement)

    from(this.elRef.nativeElement.childNodes)
      .pipe(filter(e => e.nodeType === 1))
      .forEach(el => (el as HTMLElement).style.pointerEvents = 'auto')

    this.addSubscription(fromEvent(this._docEl, 'mouseup').subscribe(_ => this._mouseReleased.next(true)))

    this.addSubscription(fromEvent<MouseEvent>(this._el, 'mousedown').pipe(filter(e => {
      return (e.target as HTMLElement).classList.contains('grabber')
    })).subscribe(event => {
      event.stopPropagation()
      event.preventDefault() // stops native html element dragging
      let lastPos = this._mousePosition(event)
      fromEvent<MouseEvent>(this._docEl, 'mousemove').pipe(takeUntil(merge(this._mouseReleased, this._windowFocusChanged))).subscribe(event => {
        const pos = this._mousePosition(event) 
        this._translate.x += (pos.x - lastPos.x)
        this._translate.y += (pos.y - lastPos.y)
        this._setTranslate()
        lastPos = pos
      })
    }))

    this.addSubscription(fromEvent<KeyboardEvent>(this._el, 'keydown').subscribe(e => {
      if (FLOATING_WINDOW_FOCUS_STACK[0] !== this._id) return
      switch (e.code) {
        case "Escape": this.closed.emit(); break
      }
    }))

    this.addSubscription(fromEvent<KeyboardEvent>(this._el, 'mousedown').pipe(filter(e => this._targetIsChild(e.target))).subscribe(e => {
      this._updateFocusStack()
    }))

    this.addSubscription(this._resizeEmitionRequests.pipe(throttleTime(50)).subscribe(_ => this.resized.emit()))
    
  }

  public override appOnDestroy(): void {
    DeleteFromArray(FLOATING_WINDOW_FOCUS_STACK, this._id)
  }

  public resize(moved: { x: number, y: number }): void {
    const {x, y} = moved
    this._appendHeight(y)
    this._appendWidth(x)
    this._emitResized()
  }

  public resizeWithTopRightAnchor(moved: { x: number, y: number }): void {
    const {x, y} = moved  
    this._appendHeight(y)
    this._appendWidth(x * -1)
    this._translate.x += x
    this._setTranslate()
    this._emitResized()
  }

  public resizeWithBottomRightAnchor(moved: { x: number, y: number }): void {
    const {x, y} = moved  
    this._appendHeight(y * -1)
    this._appendWidth(x * -1)
    this._translate.x += x
    this._translate.y += y
    this._setTranslate()
    this._emitResized()
  }

  private _updateFocusStack(): void {
    DeleteFromArray(FLOATING_WINDOW_FOCUS_STACK, this._id)
    FLOATING_WINDOW_FOCUS_STACK.unshift(this._id)
  }

  private _appendHeight  = (n: number)     => this._wrapperStyle.height    = `${this._height + n}px`
  private _appendWidth   = (n: number)     => this._wrapperStyle.width     = `${this._width + n}px`
  private _setTranslate  = ()              => this._wrapperStyle.transform = `translate(${this._translate.x}px, ${this._translate.y}px)`
  private _mousePosition = (e: MouseEvent) => ({x: e.clientX, y: e.clientY})

  private get _bounding()    : DOMRect             { return this._el.getBoundingClientRect() }
  private get _height()      : number              { return this._bounding.height }
  private get _width()       : number              { return this._bounding.width }
  private get _wrapperStyle(): CSSStyleDeclaration { return this._el.style }
  private get _docEl()       : HTMLElement         { return this.doc.documentElement }
  private get _el()          : HTMLElement         { return this.wrapper.nativeElement }

  private _targetIsChild(target: EventTarget | null): boolean {    
    if (target instanceof Element) {
      const el = target as HTMLElement
      if (!el) return false
      if (el === this._el) return true
      return this._targetIsChild(el.parentElement)
    } else return false
  }

  private _emitResized(): void {
    this._resizeEmitionRequests.next()
  }

}

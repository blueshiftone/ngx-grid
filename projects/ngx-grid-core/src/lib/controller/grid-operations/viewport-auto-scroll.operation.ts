import { fromEvent, merge, Subject, Subscription } from 'rxjs'
import { distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators'

import { IGridOperationFactory, IGridViewportAutoScrollConfigs } from '../../typings/interfaces'
import { ArrayWith } from '../../utils/array-with-elements'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class ViewportAutoScroll extends BaseGridOperation {

  private readonly distanceMouseNeedsToMove = 10 // distance mouse needs to move before auto-scroll is activated

  private readonly subscriptions: Set<Subscription> = new Set()

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run(configs: IGridViewportAutoScrollConfigs): void {
    
    /* 
    Scroll and Mouse observables are based on 4 directional states following clock order (top, right, bottom, left)
    This maps to EDirection Enum {Top, Right, Bottom, Left}
    */

    const { viewPort } = this.gridOperations
    
    const mouseAt = new ArrayWith(4).elements(() => new Subject<boolean>())
    const scroll  = new ArrayWith(4).elements(() => ({ start: new Subject<void>(), stop: new Subject<void>() }))

    const selectionStarted = this.gridEvents.CellSelectionStartedEvent.on()
    const selectionStopped = this.gridEvents.CellSelectionStoppedEvent.on()

    let selectionIsActive = false

    this.subscriptions.add(selectionStarted.subscribe(_ => selectionIsActive = true))
    this.subscriptions.add(selectionStopped.subscribe(_ => selectionIsActive = false))

    this.subscriptions.add(fromEvent<MouseEvent>(document.documentElement, 'mousedown').subscribe(e => {
      if (!this.gridOperations.HasGridFocus.run() || !selectionIsActive) return
      let distanceMouseMoved = 0;
      const lastSeenAt    = {x: e.clientX, y: e.clientY};
      
      const mouseMoves = new Subject<MouseEvent>()

      this.subscriptions.add(fromEvent<MouseEvent>(document.documentElement, 'mousemove')
        .pipe(takeUntil(selectionStopped))
        .subscribe(e => {
          distanceMouseMoved = Math.sqrt(Math.pow(lastSeenAt.y - e.clientY, 2) + Math.pow(lastSeenAt.x - e.clientX, 2))
          if (distanceMouseMoved > this.distanceMouseNeedsToMove) mouseMoves.next(e)
      }))

      this.subscriptions.add(mouseMoves.pipe(takeUntil(selectionStopped), throttleTime(50)).subscribe(e => {
        if (!viewPort) throw new Error("Viewport not defined")
        const viewportRect = viewPort.elementRef.nativeElement.getBoundingClientRect()
        mouseAt[EDirection.Top]   .next(viewPort.measureScrollOffset('top') > 0 &&     (viewportRect.y - e.clientY) + configs.triggerAreaSize > 0)
        mouseAt[EDirection.Right] .next(viewPort.measureScrollOffset('right') > 0 &&   (viewportRect.x - e.clientX + viewportRect.width) - configs.triggerAreaSize < 0)
        mouseAt[EDirection.Bottom].next(viewPort.measureScrollOffset('bottom') > 0 &&  (viewportRect.y - e.clientY + viewportRect.height) - configs.triggerAreaSize < 0)
        mouseAt[EDirection.Left]  .next(viewPort.measureScrollOffset('left') > 0 &&    (viewportRect.x - e.clientX + configs.triggerAreaSize) > 0)
      }))

    }))

    mouseAt.forEach((side, directionIndex) => {
      this.subscriptions.add(side.pipe(distinctUntilChanged()).subscribe(state => {
        if (state) scroll[directionIndex].start.next()
        else scroll[directionIndex].stop.next()
      }))
      this.subscriptions.add(scroll[directionIndex].start.subscribe(_ => {
        configs.scrollRampUp.pipe(takeUntil(merge(selectionStopped, scroll[directionIndex].stop))).subscribe(n => {
          if (!viewPort) throw new Error("Viewport not defined")

          let scrollDistance = configs.scrollFactor
          if (n > 10) scrollDistance *= 2
          if (n > 30) scrollDistance *= 4
          switch (directionIndex) {
            case EDirection.Top:
              viewPort.scrollTo({ top: viewPort.elementRef.nativeElement.scrollTop - scrollDistance })
              break
            case EDirection.Right:
              viewPort.scrollTo({ left: viewPort.elementRef.nativeElement.scrollLeft + scrollDistance })
              break
            case EDirection.Bottom:
              viewPort.scrollTo({ top: viewPort.elementRef.nativeElement.scrollTop + scrollDistance })
              break
            case EDirection.Left:
              viewPort.scrollTo({ left: viewPort.elementRef.nativeElement.scrollLeft - scrollDistance })
              break
          }
        })
      }))
    })
  }

  public override onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}

enum EDirection {
  Top,
  Right,
  Bottom,
  Left
}

import { interval, Subject, Subscription } from 'rxjs'
import { filter, first, takeUntil } from 'rxjs/operators'

import { IGridCellCoordinates } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { Operation } from '../operation.abstract'

export class ViewportScrollToCoordinates extends Operation {

  private readonly subscriptions: Set<Subscription> = new Set()

  constructor(factory: IGridOperationFactory) {
    super(factory.gridController)
    this.subscriptions.add(this.gridEvents.GridScrollToChangedEvent.on().subscribe(cellPos => {
      if (!this.gridOperations.GetIsInitialised.run()) {
        // Wait for grid to be initialised
        this.subscriptions.add(this.gridEvents.GridInitialisedEvent.onWithInitialValue().pipe(filter(v => v === true), first()).subscribe(_ => {
          this._scrollTo(cellPos)
        }))
        return
      }
      this._scrollTo(cellPos)
    }))
  }

  public run(coordinates: IGridCellCoordinates): void {
    this.gridEvents.GridScrollToChangedEvent.emit(coordinates)
  }

  private _scrollTo(cellPos: IGridCellCoordinates) {
    const { viewPort } = this.gridOperations
    if (!viewPort) return
    const utils              = GridImplementationFactory.gridSelectionRange(this.controller).globalUtils
    const maxItemsInViewport = Math.floor(viewPort.getViewportSize() / 25) -2
    const firstVisibleIndex  = Math.floor(viewPort.measureScrollOffset('top') / 25) + 1
    const lastVisibleIndex   = firstVisibleIndex + maxItemsInViewport -1
    const rowIndex           = utils.getRowIndex(cellPos.rowKey)
    const rowAlreadyVisible  = rowIndex >= firstVisibleIndex && rowIndex <= lastVisibleIndex
    if (!rowAlreadyVisible) {
      let scrollToIndex = 0
      if (rowIndex > firstVisibleIndex) scrollToIndex = rowIndex - maxItemsInViewport
      else scrollToIndex = rowIndex - 1
      viewPort.scrollToIndex(Math.max(scrollToIndex, 0))
    }
    const componentRendered = new Subject<void>()
    interval(10).pipe(takeUntil(componentRendered)).subscribe(_ => {
      const cellComponent = this.cellOperations.CellComponents.findWithCoords(cellPos)
      if (typeof cellComponent !== 'undefined') {
        componentRendered.next()
        const leftScrollOffset  = viewPort.measureScrollOffset('left')
        const viewportWidth     = viewPort.getElementRef().nativeElement.clientWidth
        const viewportLeftBound = leftScrollOffset
        const cellLeftBound     = cellComponent.element.offsetLeft
        const cellWidth         = cellComponent.element.clientWidth
        const cellRightBound    = cellLeftBound + cellWidth

        const cellClipping = this.gridOperations.GetCellVisibility.run(cellPos)
        if (!cellClipping) throw new Error('Unable to get cell visibility due to viewport not initialised.')

        if (cellClipping.clippedLeft || cellClipping.clippedRight) {
          let nextLeftScrollOffset = 0
          if (cellComponent.element.clientWidth > viewportWidth) nextLeftScrollOffset = cellLeftBound - 20
          else if (cellClipping.clippedRight)                    nextLeftScrollOffset = viewportLeftBound + (cellRightBound - (viewportLeftBound + viewportWidth)) + 20
          else                                                   nextLeftScrollOffset = viewportLeftBound - (viewportLeftBound - cellLeftBound) - 42
          viewPort.scrollTo({ left: nextLeftScrollOffset })
        }
      }
    }).add(() => {
      this.gridEvents.GridScrollArrivedAtCoordinatesEvent.emit(cellPos)
      componentRendered.complete()
    })
  }

  public override onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}

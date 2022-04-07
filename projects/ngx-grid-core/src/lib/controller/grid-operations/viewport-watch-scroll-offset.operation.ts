import { Subject, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, repeat, takeUntil } from 'rxjs/operators'

import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class ViewportWatchScrollOffset extends Operation {

  private readonly subscriptions: Set<Subscription> = new Set()

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {
    const { viewPort } = this.gridOperations
    if (!viewPort) throw new Error("Viewport not defined")
    this.subscriptions.add(viewPort.elementScrolled().pipe(
      map(_ => ({
        fromTop : viewPort?.measureScrollOffset('top') || 0,
        fromLeft: viewPort?.measureScrollOffset('left') || 0
      }))
    ).subscribe(offset => {
      this.gridEvents.GridScrollOffsetChangedEvent.emit(offset)
    }))

    const stoppedScroll = new Subject<void>()

    this.subscriptions.add(viewPort.elementScrolled().pipe(
      takeUntil(stoppedScroll),
      map(_ => 1),
      distinctUntilChanged(),
      repeat()
    ).subscribe(_ => this.gridEvents.GridScrollStartedEvent.emit(true)))
    this.subscriptions.add(viewPort.elementScrolled().pipe(
      debounceTime(50)
    ).subscribe(_ => {
      stoppedScroll.next()
      this.gridEvents.GridScrollStoppedEvent.emit(true)
    }))

  }

  public override onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

}

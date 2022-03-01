import { Observable } from 'rxjs'
import { distinctUntilChanged, pairwise, startWith } from 'rxjs/operators'

import { IGridEvent } from '../typings/interfaces'
import { GridEventsService, TGridEventName } from './grid-events.service'

export abstract class BaseGridEventAbstract<TPayload> implements IGridEvent<TPayload> {
  
  public readonly abstract eventName: TGridEventName
  
  constructor(private _eventService: GridEventsService) {}

  public on(): Observable<TPayload> {
    return this._eventService.on(this.eventName)
  }

  public onWithInitialValue(): Observable<TPayload | undefined> {
    return this.on().pipe(startWith(this.state))
  }

  public onChanges(): Observable<[TPayload | undefined, TPayload | undefined]> {
    return this.on().pipe(startWith(this.state), distinctUntilChanged(), pairwise())
  }

  public emit(payload: TPayload): void {
    this._eventService.emit({
      eventName: this.eventName,
      payload
    })
  }

  public get state() {
    return this._eventService.stateOf<TPayload>(this.eventName)
  }

}

import { Observable } from 'rxjs'
import { pairwise, startWith } from 'rxjs/operators'

import { IGridEvent } from '../typings/interfaces'
import { GridEventsService, TGridEventName } from './grid-events.service'

export abstract class BaseGridEventAbstract<TPayload> implements IGridEvent<TPayload> {
  
  public readonly abstract eventName: TGridEventName
  
  constructor(private _eventService: GridEventsService) {}

  /**
   * Returns an observable that emits future event payloads
   * 
   */
   public on(): Observable<TPayload> {
    return this._eventService.on(this.eventName)
  }

  /**
   * Returns an observable that emits future event payloads
   * 
   * @param ignoredSource - Events emitted from this source will be ignored
   * 
   */
   public ignore(ignoredSource: any): Observable<TPayload> {
    return this._eventService.on(this.eventName, ignoredSource)
  }

  /**
   * Returns an observable that emits future event payloads + the source
   * 
   */
   public onWithSource(): Observable<{source: any, payload: TPayload}> {
    return this._eventService.onWithSource(this.eventName)
  }

  /**
   * Returns an observable that emits future event payloads + the source
   * 
   * @param ignoredSource - Events emitted from this source will be ignored
   * 
   */
   public ignoreWithSource(ignoredSource: any): Observable<{source: any, payload: TPayload}> {
    return this._eventService.onWithSource(this.eventName, ignoredSource)
  }

  /**
   * Returns an observable that immediately emits the last event payload and then future payloads
   * 
   */
  public onWithInitialValue(): Observable<TPayload | undefined> {
    return this.on().pipe(startWith(this.state))
  }

  /**
   * Returns an observable that immediately emits the last event payload and then future payloads
   * 
   * @param ignoredSource - Payloads emitted from this source will be ignored
   * 
   */
  public ignoreWithInitialValue(ignoredSource: any): Observable<TPayload | undefined> {
    return this.ignore(ignoredSource).pipe(startWith(this.state))
  }

  /**
   * Returns an observable that emits changes to the event state
   * 
   */
  public onChanges(): Observable<[TPayload | undefined, TPayload | undefined]> {
    return this.on().pipe(startWith(this.state), pairwise())
  }

  /**
   * Returns an observable that emits changes to the event state
   * 
   * @param ignoredSource - Events emitted from this source will be ignored
   * 
   */
  public ignoreChanges(ignoredSource: any): Observable<[TPayload | undefined, TPayload | undefined]> {
    return this.ignore(ignoredSource).pipe(startWith(this.state), pairwise())
  }

  /**
   * Broadcasts an event payload to all listeners and updates the event state
   * 
   * @param payload - The payload to broadcast
   * @param eventSource - The source of the event, optional
   * 
   * @remarks
   * When eventSource is provided, later listeners can ignore events that were emitted from the source
   * 
   */
  public emit(payload: TPayload, eventSource?: any): void {
    this._eventService.emit({
      eventName: this.eventName,
      payload,
      eventSource
    })
  }

  public get state() {
    return this._eventService.stateOf<TPayload>(this.eventName)
  }

}

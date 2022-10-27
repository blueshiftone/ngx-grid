import { Injectable } from '@angular/core'
import { filter, map, Observable, Subject, Subscription } from 'rxjs'

import * as gridEvents from '.'
import { IGridEventPacket } from '../typings/interfaces'
import { TInstanceTypeProps } from '../typings/types'

export type TGridEventName = keyof typeof gridEvents
export type TGridEvents = TInstanceTypeProps<typeof gridEvents>

export interface IGridEventsFactory extends TGridEvents {
  onDestroy(): void
}

@Injectable()
export class GridEventsService {

  public eventStream = new Subject<IGridEventPacket>()

  private _observables: Map<TGridEventName, Subject<IGridEventPacket>> = new Map()
  private _subscriptions = new Set<Subscription>()
  private _events: TGridEvents
  private _state: { [key in TGridEventName ]?: any } = {}

  public factory: IGridEventsFactory

  constructor() {
    this._subscriptions.add(this.eventStream.subscribe(e => this._notifyListeners(e)))

    this.factory = {
      onDestroy: () => this.onDestroy()
    } as IGridEventsFactory

    this._events = {} as TGridEvents
    for (const key of (Object.keys(gridEvents) as (keyof typeof gridEvents)[])) this._events[key] = new gridEvents[key](this) as any
    Object.assign(this.factory, this._events)

  }

  public emit(...events: IGridEventPacket[]): void {
    for (const e of events) {
      this._state[e.eventName] = e.payload
      this.eventStream.next(e)
    }
  }

  /**
   * Provides an observable for event payloads
   * 
   * @param eventName - The name of the event to listen to
   * @param ignoreEventsFromSource - Will ignore events that were emitted from the source
   * 
   */
   public on<T = any>(eventName: TGridEventName, ignoreEventsFromSource?: any): Observable<T> {
    let observable: Observable<IGridEventPacket<T>> = this._getObservable<T>(eventName)
    if (ignoreEventsFromSource !== undefined) {
      observable = observable.pipe(filter(e => e.eventSource !== ignoreEventsFromSource))
    }
    return observable.pipe(map(e => e.payload))
  }

  /**
   * Provides an observable for event payloads + source
   * 
   * @param eventName - The name of the event to listen to
   * @param ignoreEventsFromSource - Will ignore events that were emitted from the source
   * 
   */
   public onWithSource<T = any>(eventName: TGridEventName, ignoreEventsFromSource?: any): Observable<{source: any, payload: T}> {
    let observable: Observable<IGridEventPacket<T>> = this._getObservable<T>(eventName)
    if (ignoreEventsFromSource !== undefined) {
      return observable.pipe(filter(e => e.eventSource !== ignoreEventsFromSource), map(e => ({ source: e.eventSource, payload: e.payload })))
    }
    return observable.pipe(map(e => ({ source: e.eventSource, payload: e.payload })))
  }

  public stateOf<T = any>(e: TGridEventName): T | undefined {
    return this._state[e]
  }

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  private _notifyListeners(e: IGridEventPacket): void {
    this._getObservable(e.eventName).next(e)
  }

  private _getObservable<T>(evName: TGridEventName): Subject<IGridEventPacket<T>> {
    return this._observables.get(evName) ?? this._observables.set(evName, new Subject<IGridEventPacket<T>>()).get(evName)!
  }

}
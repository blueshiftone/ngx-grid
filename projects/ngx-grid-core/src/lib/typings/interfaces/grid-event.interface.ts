import { Observable } from 'rxjs'

import { TGridEventName } from '../../events/grid-events.service'

export interface IGridEvent<TPayload = any> {
  readonly eventName: TGridEventName
  on(): Observable<TPayload>
  onChanges(): Observable<[TPayload | undefined, TPayload | undefined]>
  onWithInitialValue(): Observable<TPayload | undefined>
  emit(payload: TPayload): void
}

export interface IGridEventPacket<TPayload = any> {
  eventName: TGridEventName
  payload  : TPayload
}

import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class GridScrollStartedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'GridScrollStartedEvent'
}

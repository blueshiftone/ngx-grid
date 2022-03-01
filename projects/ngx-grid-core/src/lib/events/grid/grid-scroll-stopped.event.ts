import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class GridScrollStoppedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'GridScrollStoppedEvent'
}

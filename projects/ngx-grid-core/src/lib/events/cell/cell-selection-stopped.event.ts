import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class CellSelectionStoppedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'CellSelectionStoppedEvent'
}

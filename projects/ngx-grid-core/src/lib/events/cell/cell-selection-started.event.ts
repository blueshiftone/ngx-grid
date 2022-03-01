import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class CellSelectionStartedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'CellSelectionStartedEvent'
}

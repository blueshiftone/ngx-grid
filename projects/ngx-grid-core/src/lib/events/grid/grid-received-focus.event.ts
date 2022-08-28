import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridReceivedFocusEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'GridReceivedFocusEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

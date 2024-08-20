import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CloseColumnMenuRequestedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'CloseColumnMenuRequestedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

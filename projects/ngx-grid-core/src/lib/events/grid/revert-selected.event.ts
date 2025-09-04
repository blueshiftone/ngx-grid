import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RevertSelectedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'RevertSelectedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class SaveGridEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'SaveGridEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

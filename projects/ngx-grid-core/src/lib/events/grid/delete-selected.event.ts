import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class DeleteSelectedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'DeleteSelectedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

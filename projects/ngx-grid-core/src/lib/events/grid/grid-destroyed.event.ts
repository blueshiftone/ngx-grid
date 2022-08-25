import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridDestroyedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'GridDestroyedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

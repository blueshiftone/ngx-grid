import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridInitialisedEvent extends BaseGridEventAbstract<boolean> {
  public readonly eventName = 'GridInitialisedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

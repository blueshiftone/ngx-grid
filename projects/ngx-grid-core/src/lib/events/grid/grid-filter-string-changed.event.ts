import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridFilterStringChangedEvent extends BaseGridEventAbstract<string> {
  public readonly eventName = 'GridFilterStringChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

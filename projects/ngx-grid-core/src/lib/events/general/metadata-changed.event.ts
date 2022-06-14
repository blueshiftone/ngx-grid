import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class MetadataChangedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'MetadataChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

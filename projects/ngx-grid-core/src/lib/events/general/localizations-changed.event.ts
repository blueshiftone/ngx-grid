import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class LocalizationsChangedEvent extends BaseGridEventAbstract<void> {
  public readonly eventName = 'LocalizationsChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

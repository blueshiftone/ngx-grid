import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnsChangedEvent extends BaseGridEventAbstract<void | null> {
  public readonly eventName = 'ColumnsChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

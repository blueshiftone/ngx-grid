import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridFileDragStateChangedEvent extends BaseGridEventAbstract<boolean> {
  public readonly eventName = 'GridFileDragStateChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

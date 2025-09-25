import { BaseGridEventAbstract } from "../base-grid-event.abstract"
import { GridEventsService } from "../grid-events.service"

export class GridViewportSizeCheckedEvent extends BaseGridEventAbstract<void> {
    public readonly eventName = 'GridViewportSizeCheckedEvent'
    constructor(eventService: GridEventsService) { super(eventService) }
  }
  
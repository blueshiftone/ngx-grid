import { TGridMode } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridModeChangedEvent extends BaseGridEventAbstract<TGridMode> {
  public readonly eventName = 'GridModeChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

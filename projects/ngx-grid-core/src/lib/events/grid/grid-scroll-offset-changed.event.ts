import { IGridScrollOffset } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridScrollOffsetChangedEvent extends BaseGridEventAbstract<IGridScrollOffset> {
  public readonly eventName = 'GridScrollOffsetChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

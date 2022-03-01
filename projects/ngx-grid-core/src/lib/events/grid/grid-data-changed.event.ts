import { IGridDataSource } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridDataChangedEvent extends BaseGridEventAbstract<IGridDataSource> {
  public readonly eventName = 'GridDataChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

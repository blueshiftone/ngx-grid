import { IFieldSortConfig } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnSortByRequestedEvent extends BaseGridEventAbstract<IFieldSortConfig[]> {
  public readonly eventName = 'ColumnSortByRequestedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

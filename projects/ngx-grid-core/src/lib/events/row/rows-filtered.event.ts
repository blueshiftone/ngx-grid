import { IGridRow } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowsFilteredEvent extends BaseGridEventAbstract<IGridRow[] | null> {
  public readonly eventName = 'RowsFilteredEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

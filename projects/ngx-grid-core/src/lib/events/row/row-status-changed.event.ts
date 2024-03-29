import { IGridRow } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowStatusChangedEvent extends BaseGridEventAbstract<IGridRow[]> {
  public readonly eventName = 'RowStatusChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

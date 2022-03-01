import { IGridRow } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowInsertedEvent extends BaseGridEventAbstract<IGridRow> {
  public readonly eventName = 'RowInsertedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

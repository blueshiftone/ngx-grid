import { TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowDeletedEvent extends BaseGridEventAbstract<TPrimaryKey> {
  public readonly eventName = 'RowDeletedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

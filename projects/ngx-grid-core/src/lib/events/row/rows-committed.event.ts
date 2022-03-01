import { TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowsCommittedEvent extends BaseGridEventAbstract<TPrimaryKey[]> {
  public readonly eventName = 'RowsCommittedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

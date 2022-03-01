import { TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowsRevertedEvent extends BaseGridEventAbstract<TPrimaryKey[]> {
  public readonly eventName = 'RowsRevertedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

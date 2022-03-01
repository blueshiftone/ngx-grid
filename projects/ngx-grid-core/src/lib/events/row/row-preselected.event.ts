import { TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowPreselectedEvent extends BaseGridEventAbstract<TPrimaryKey | null> {
  public readonly eventName = 'RowPreselectedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

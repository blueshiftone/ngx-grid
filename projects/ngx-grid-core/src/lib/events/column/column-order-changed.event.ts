import { TColumnKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnOrderChangedEvent extends BaseGridEventAbstract<Map<TColumnKey, number>> {
  public readonly eventName = 'ColumnOrderChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class MetadataChangedEvent extends BaseGridEventAbstract<{ rowKey?: TPrimaryKey, columnKey?: TColumnKey }> {
  public readonly eventName = 'MetadataChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

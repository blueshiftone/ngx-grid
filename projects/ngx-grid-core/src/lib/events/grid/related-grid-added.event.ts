import { IGridDataSource } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RelatedGridAddedEvent extends BaseGridEventAbstract<IGridDataSource> {
  public readonly eventName = 'RelatedGridAddedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

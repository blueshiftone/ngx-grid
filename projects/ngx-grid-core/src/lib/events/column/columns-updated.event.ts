import { IGridColumns } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnsUpdatedEvent extends BaseGridEventAbstract<IGridColumns> {
  public readonly eventName = 'ColumnsUpdatedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

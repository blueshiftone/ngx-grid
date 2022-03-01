import { IGridColumnOrder } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnOrderChangedEvent extends BaseGridEventAbstract<IGridColumnOrder[]> {
  public readonly eventName = 'ColumnOrderChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

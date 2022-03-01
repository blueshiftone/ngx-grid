import { IGridColumnOrder } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnOrderSavedEvent extends BaseGridEventAbstract<IGridColumnOrder[]> {
  public readonly eventName = 'ColumnOrderSavedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

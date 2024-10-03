import { IGridRowComponent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowDoubleClickedEvent extends BaseGridEventAbstract<IGridRowComponent> {
  public readonly eventName = 'RowDoubleClickedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

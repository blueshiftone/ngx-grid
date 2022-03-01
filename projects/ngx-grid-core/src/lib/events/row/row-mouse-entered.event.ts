import { IGridRowComponent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowMouseEnteredEvent extends BaseGridEventAbstract<IGridRowComponent> {
  public readonly eventName = 'RowMouseEnteredEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridKeyboardEvent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridKeypressedEvent extends BaseGridEventAbstract<IGridKeyboardEvent> {
  public readonly eventName = 'GridKeypressedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridKeyboardEvent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridKeyCmdPressedEvent extends BaseGridEventAbstract<IGridKeyboardEvent> {
  public readonly eventName = 'GridKeyCmdPressedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

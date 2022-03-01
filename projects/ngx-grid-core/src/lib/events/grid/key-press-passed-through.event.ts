import { IGridKeyboardEvent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class KeyPressPassedThroughEvent extends BaseGridEventAbstract<IGridKeyboardEvent | null> {
  public readonly eventName = 'KeyPressPassedThroughEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

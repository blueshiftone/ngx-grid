import { TGridUITheme } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridUIThemeChangedEvent extends BaseGridEventAbstract<TGridUITheme> {
  public readonly eventName = 'GridUIThemeChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

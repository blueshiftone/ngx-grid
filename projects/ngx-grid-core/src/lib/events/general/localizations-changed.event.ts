import { IGridDataSource } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class LocalizationsChanged extends BaseGridEventAbstract<IGridDataSource> {
  public readonly eventName = 'LocalizationsChanged'
  constructor(eventService: GridEventsService) { super(eventService) }
}

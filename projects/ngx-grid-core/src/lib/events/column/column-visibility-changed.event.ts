import { IGridColumnVisibility } from '../../typings/interfaces/grid-column-visibility.interface'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnVisibilityChangedEvent extends BaseGridEventAbstract<IGridColumnVisibility[]> {
  public readonly eventName = 'ColumnVisibilityChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

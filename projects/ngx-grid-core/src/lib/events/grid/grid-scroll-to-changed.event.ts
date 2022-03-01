import { IGridCellCoordinates } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridScrollToChangedEvent extends BaseGridEventAbstract<IGridCellCoordinates> {
  public readonly eventName = 'GridScrollToChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

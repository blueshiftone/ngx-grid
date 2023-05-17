import { IGridCellCoordinates } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridScrollArrivedAtCoordinatesEvent extends BaseGridEventAbstract<IGridCellCoordinates> {
  public readonly eventName = 'GridScrollArrivedAtCoordinatesEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

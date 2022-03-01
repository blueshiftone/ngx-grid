import { IGridCellComponent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellMouseEnteredEvent extends BaseGridEventAbstract<IGridCellComponent> {
  public readonly eventName = 'CellMouseEnteredEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

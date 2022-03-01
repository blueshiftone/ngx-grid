import { IGridCellFocused } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellFocusChangedEvent extends BaseGridEventAbstract<IGridCellFocused | undefined> {
  public readonly eventName = 'CellFocusChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridCellComponent } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class EditingCellChangedEvent extends BaseGridEventAbstract<IGridCellComponent | null> {
  public readonly eventName = 'EditingCellChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

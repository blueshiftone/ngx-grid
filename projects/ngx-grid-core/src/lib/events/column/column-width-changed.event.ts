import { IGridColumnWidths } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnWidthChangedEvent extends BaseGridEventAbstract<IGridColumnWidths> {
  public readonly eventName = 'ColumnWidthChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

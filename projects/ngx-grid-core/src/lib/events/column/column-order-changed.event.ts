import { IGridColumn } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnOrderChangedEvent extends BaseGridEventAbstract<IGridColumn[]> {
  public readonly eventName = 'ColumnOrderChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

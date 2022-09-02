import { IGridColumn } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnsAddedEvent extends BaseGridEventAbstract<IGridColumn[]> {
  public readonly eventName = 'ColumnsAddedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridRow } from '../../typings/interfaces'
import { TPrimaryKey } from '../../typings/types'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class RowKeyMapChangedEvent extends BaseGridEventAbstract<Map<TPrimaryKey, IGridRow>> {
  public readonly eventName = 'RowKeyMapChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

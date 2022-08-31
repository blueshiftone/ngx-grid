import { IFieldSortConfig, IGridRow } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ColumnSortByChangedEvent extends BaseGridEventAbstract<{rows?: IGridRow[], sortConfig: Map<string, IFieldSortConfig>}> {
  public readonly eventName = 'ColumnSortByChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

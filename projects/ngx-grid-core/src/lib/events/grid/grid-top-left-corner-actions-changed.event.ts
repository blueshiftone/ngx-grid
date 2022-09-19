import { IGridCornerAction } from '../../controller/grid-operations/grid-top-left-corner-actions.operation'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridTopLeftCornerActionsChangedEvent extends BaseGridEventAbstract<IGridCornerAction[] | null> {
  public readonly eventName = 'GridTopLeftCornerActionsChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridSelectionRange } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellSelectionChangedEvent extends BaseGridEventAbstract<IGridSelectionRange | null> {
  public readonly eventName = 'CellSelectionChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}


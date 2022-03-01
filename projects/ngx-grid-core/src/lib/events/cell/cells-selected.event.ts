import { IGridSelectionSlice } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellsSelectedEvent extends BaseGridEventAbstract<IGridSelectionSlice | null> {
  public readonly eventName = 'CellsSelectedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

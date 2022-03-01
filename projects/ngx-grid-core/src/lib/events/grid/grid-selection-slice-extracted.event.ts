import { IGridSelectionSlice } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridSelectionSliceExtractedEvent extends BaseGridEventAbstract<IGridSelectionSlice> {
  public readonly eventName = 'GridSelectionSliceExtractedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

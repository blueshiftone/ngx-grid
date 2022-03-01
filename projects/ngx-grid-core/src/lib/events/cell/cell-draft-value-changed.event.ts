import { IGridCellValue } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellDraftValueChangedEvent extends BaseGridEventAbstract<IGridCellValue> {
  public readonly eventName = 'CellDraftValueChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

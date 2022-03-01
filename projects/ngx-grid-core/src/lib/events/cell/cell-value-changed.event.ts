import { IGridCellValue } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellValueChangedEvent extends BaseGridEventAbstract<IGridCellValue[]> {
  public readonly eventName = 'CellValueChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridCellCoordinates } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class CellForeignValueParsingFailedEvent extends BaseGridEventAbstract<{
  cellKey: IGridCellCoordinates
  value: any
}[]> {
  public readonly eventName = 'CellForeignValueParsingFailedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

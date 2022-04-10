import { EForeignKeyDropdownState } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class ForeignKeyDropdownStateChangedEvent extends BaseGridEventAbstract<{ coordinates: IGridCellCoordinates, state: EForeignKeyDropdownState }> {
  public readonly eventName = 'ForeignKeyDropdownStateChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

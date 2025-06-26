import {BaseGridEventAbstract} from "../base-grid-event.abstract";
import {GridEventsService} from "../grid-events.service";
import { IGridCellCoordinates } from '../../typings/interfaces'

export class SearchDropdownOptionsEvent  extends BaseGridEventAbstract<{ searchString: string, coordinates: IGridCellCoordinates }> {
  public readonly eventName = 'SearchDropdownOptionsEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

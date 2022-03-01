import { IGridFilesSelected } from '../../typings/interfaces/grid-files-selected.initerface'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridFileUploadCreatedEvent extends BaseGridEventAbstract<IGridFilesSelected> {
  public readonly eventName = 'GridFileUploadCreatedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { IGridFileDownloadRequest } from '../../typings/interfaces/grid-file-download-request.interface'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'


export class FileDownloadRequestedEvent extends BaseGridEventAbstract<IGridFileDownloadRequest> {
  public readonly eventName = 'FileDownloadRequestedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

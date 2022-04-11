import { IGridOverlayOpenedPayload } from '../../typings/interfaces/grid-overlay-opened-payload.interface'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridOverlayOpenedEvent extends BaseGridEventAbstract<IGridOverlayOpenedPayload> {
  public readonly eventName = 'GridOverlayOpenedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

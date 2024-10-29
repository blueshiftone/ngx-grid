import { INgxGridTheme } from '../../ui/themes/ngx-grid-theme.interface'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'
import { GridEventsService } from '../grid-events.service'

export class GridThemeChangedEvent extends BaseGridEventAbstract<{theme: INgxGridTheme, rowHeight: number, thumbWidth: number}> {
  public readonly eventName = 'GridThemeChangedEvent'
  constructor(eventService: GridEventsService) { super(eventService) }
}

import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class GridWasModifiedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'GridWasModifiedEvent'
}

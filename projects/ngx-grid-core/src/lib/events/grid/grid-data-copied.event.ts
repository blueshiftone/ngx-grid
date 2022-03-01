import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class GridDataCopiedEvent extends BaseGridEventAbstract<true> {
  public readonly eventName = 'GridDataCopiedEvent'
}

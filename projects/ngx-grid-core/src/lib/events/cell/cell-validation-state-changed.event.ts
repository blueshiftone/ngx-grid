import { IGridCellValidationState } from '../../typings/interfaces'
import { BaseGridEventAbstract } from '../base-grid-event.abstract'

export class CellValidationStateChangedEvent extends BaseGridEventAbstract<IGridCellValidationState> {
  public readonly eventName = 'CellValidationStateChangedEvent'
}

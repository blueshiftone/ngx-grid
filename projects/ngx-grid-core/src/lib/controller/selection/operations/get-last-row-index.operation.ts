import { ISelectionController } from '../../../typings/interfaces'

export class GetLastRowIndex {

  constructor(private readonly controller: ISelectionController) { }

  public run(): number {
    return ((this._source?.rows.latestValue.length) || 1) - 1
  }

  private get _source() {
    return this.controller.gridEvents.GridDataChangedEvent.state
  }

}

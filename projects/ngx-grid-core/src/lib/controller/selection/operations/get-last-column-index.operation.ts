import { ISelectionController } from '../../../typings/interfaces'

export class GetLastColumnIndex {

  constructor(private readonly controller: ISelectionController) { }

  public run(): number {
    return (this.controller.gridEvents.ColumnsUpdatedEvent.state?.visibleColumns.length ?? 1) - 1
  }

}

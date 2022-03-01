import { GridSelectionController } from '../grid-selection.controller'

export class GetLastColumnIndexOperation {

  constructor(private readonly controller: GridSelectionController) { }

  public run(): number {
    return (this.controller.gridEvents.ColumnsUpdatedEvent.state?.visibleColumns.length ?? 1) - 1
  }

}

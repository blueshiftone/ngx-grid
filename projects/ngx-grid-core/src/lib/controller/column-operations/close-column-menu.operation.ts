import { IColumnOperationFactory } from "../../typings/interfaces"
import { Operation } from "../operation.abstract"

export class CloseClolumnMenu extends Operation {
  constructor(factory: IColumnOperationFactory) { super(factory.gridController) }

  public run(): void {
    this.gridEvents.CloseColumnMenuRequestedEvent.emit()
  }
}

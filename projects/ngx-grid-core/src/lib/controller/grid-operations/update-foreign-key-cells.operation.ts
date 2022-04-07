import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class UpdateForeignKeyCells extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(relatedGridID: string) {
    const cols = this.columnOperations.GetColumnMeta.getAll().filter(m => m.type?.list?.relatedGridID === relatedGridID)
    for (const col of cols) {
      const cells = this.cellOperations.CellComponents.findForColumn(col.columnKey)
      for (const cell of cells) {
        if (!cell.typeComponent) continue;
        cell.typeComponent.receiveValue(cell.typeComponent.value)
      }
    }
  }
}

import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellIsEditable extends Operation { 
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates): boolean {
    const cellCanUpdate = this.cellOperations.GetCellMetaValue.run<boolean>(coordinates, EMetadataType.CanUpdate)
    if (cellCanUpdate === false) {
      return false
    } else {
      const canRowUpdate = this.rowOperations.GetRowMeta.run(coordinates.rowKey)?.canUpdate
      if (canRowUpdate === false) {
        return false
      } else {
        return true
      }
    }
  }
}

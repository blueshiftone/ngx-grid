import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class GetCellMetaValue extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run<T>(coordinates: IGridCellCoordinates, type: EMetadataType): T | null {
    return this.cellOperations.GetCellMeta.run(coordinates)?.metadata?.get<T>(type)
      ?? this.dataSource.getColumn(coordinates.columnKey)?.metadata?.get<T>(type)
      ?? this.dataSource.getRow(coordinates.rowKey)?.metadata?.get<T>(type)
      ?? this.dataSource.metadata?.get<T>(type)
      ?? null
  }
  
}

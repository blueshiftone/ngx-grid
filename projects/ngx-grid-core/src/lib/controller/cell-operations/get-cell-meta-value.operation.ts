import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetCellMetaValue extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  public run<T>(coordinates: IGridCellCoordinates, type: EMetadataType): T | null {
    return this.cellOperations.GetCellMeta.run(coordinates)?.metadata?.get<T>(type)
      ?? this.rowOperations.GetRowMeta.run(coordinates.rowKey)?.metadata?.get<T>(type)
      ?? this.columnOperations.GetColumnMeta.run(coordinates.columnKey)?.metadata?.get<T>(type)
      ?? this.gridOperations.source().metadata?.get<T>(type)
      ?? null
  }
  
}

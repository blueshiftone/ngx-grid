import { IGridCellCoordinates, IGridCellMeta, IGridMetadataInfo } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { Operation } from '../operation.abstract'

export class SetCellMeta extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(coordinates: IGridCellCoordinates, input: Partial<IGridCellMeta> | IGridMetadataInfo[]): void {

    const meta: IGridCellMeta = this.cellOperations.GetCellMeta.run(coordinates) ?? {
      coords: new GridCellCoordinates(coordinates.rowKey, coordinates.columnKey),
      metadata: GridImplementationFactory.gridMetadataCollection(),
    }

    if (Array.isArray(input)) {
      for (const item of input) meta.metadata.set(item.key, item.value)
    } else {    
      if ((input.metadata?.items ?? []).length > 0) {
        for (const item of input.metadata!.items) meta.metadata.set(item.key, item.value)
        delete input.metadata
      }
      Object.assign(meta, input)
    }    

    this.dataSource.cellMeta.set(coordinates.compositeKey, meta)
  }

}

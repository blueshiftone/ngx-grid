import { IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../typings/types'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class GetAllCellMetaForDirtyRows extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  public run(rowKeys?: TPrimaryKey[]): IGridCellMeta[] {
    
    const columns = this.columnOperations.GetColumns.run()

    rowKeys = rowKeys ?? [...this.rowOperations.dirtyRowsMap.values()].map(row => row.rowKey) ?? [];

    return rowKeys.reduce<IGridCellMeta[]>((output, rowKey) => {
      output.push(...columns.reduce<IGridCellMeta[]>((output, columnKey) => {
        const coords = new GridCellCoordinates(rowKey, columnKey)
        output.push(this.cellOperations.GetCellMeta.run(coords) ?? { coords, metadata: GridImplementationFactory.gridMetadataCollection() })
        return output;
      }, []))
      return output;
    }, [])

  }

}

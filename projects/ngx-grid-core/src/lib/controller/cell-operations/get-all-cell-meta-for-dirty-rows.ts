import { IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetAllCellMetaForDirtyRows extends Operation { 
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(rowKeys?: TPrimaryKey[]): IGridCellMeta[] {

    rowKeys = rowKeys ?? [...this.rowOperations.dirtyRowsMap.values()].map(row => row.rowKey) ?? [];

    return rowKeys.reduce<IGridCellMeta[]>((output, rowKey) => {
      output.push(...this.dataSource.columns.reduce<IGridCellMeta[]>((output, column) => {
        const coords = new GridCellCoordinates(rowKey, column.columnKey)
        output.push(this.cellOperations.GetCellMeta.run(coords) ?? { coords, metadata: GridImplementationFactory.gridMetadataCollection() })
        return output;
      }, []))
      return output;
    }, [])

  }

}

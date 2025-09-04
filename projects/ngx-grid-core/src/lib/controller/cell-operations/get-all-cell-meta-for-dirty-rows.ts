import { IGridCellMeta } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetAllCellMetaForDirtyRows extends Operation { 
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(rowKeys?: TPrimaryKey[]): IGridCellMeta[] {
    const rows = rowKeys ? rowKeys.map(k => this.dataSource.getRow(k)) : this.rowOperations.dirtyRowsMap.values()
    
    const metadataList: IGridCellMeta[] = [];
    
    for (const row of rows) {
      if (!row) continue
      for (const column of this.dataSource.columns) {
        const coords = new GridCellCoordinates(row.rowKey, column.columnKey);
        
        // Get the cell's metadata or create a default if it doesn't exist.
        const cellMeta = this.cellOperations.GetCellMeta.run(coords) ?? {
          coords,
          metadata: GridImplementationFactory.gridMetadataCollection(),
        };
        
        metadataList.push(cellMeta);
      }
    }
    
    return metadataList;
  }

}

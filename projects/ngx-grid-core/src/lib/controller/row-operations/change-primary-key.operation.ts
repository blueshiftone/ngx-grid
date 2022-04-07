import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class ChangePrimaryKey extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(oldRowKey: TPrimaryKey, newRowKey: TPrimaryKey) {

    const rowOps               = this.rowOperations
    const { primaryColumnKey } = this.dataSource
    const { cellOperations }   = this

    // Update row
    this.dataSource.changeRowPrimaryKey(oldRowKey, newRowKey)

    // Update dirty rows map
    const dirtyRow = rowOps.dirtyRowsMap.get(oldRowKey)
    if (dirtyRow) { 
      rowOps.dirtyRowsMap.delete(oldRowKey)
      rowOps.dirtyRowsMap.set(newRowKey, dirtyRow)
    }

    // Update row meta map
    const rowMeta = rowOps.GetRowMeta.run(oldRowKey)
    if (rowMeta) { 
      rowMeta.rowKey = newRowKey
      rowOps.RemoveRowMeta.run(oldRowKey)
      rowOps.SetRowMeta.run(newRowKey, rowMeta)
    }

    // Update cell meta maps and cells
    for (const columnKey of this.dataSource.columns) {
      const cellMeta = cellOperations.GetCellMeta.run(new GridCellCoordinates(oldRowKey, columnKey))
      if (cellMeta) cellMeta.coords.rowKey = newRowKey
    }
    cellOperations.CellComponents.findWithCoords(new GridCellCoordinates(oldRowKey, primaryColumnKey))?.typeComponent?.receiveValue(newRowKey);

    // Update selection state
    const selection = this.selection.latestSelection
    selection?.changePrimaryKey(oldRowKey, newRowKey)

    // Update focused state
    const focused = this.gridEvents.CellFocusChangedEvent.state
    if (focused && focused.rowKey === oldRowKey) focused.rowKey = newRowKey  

    // Update component maps
    this.rowOperations.RowComponents.changePrimaryKey(oldRowKey, newRowKey)
    cellOperations.CellComponents.changePrimaryKey(oldRowKey, newRowKey)

  }

}

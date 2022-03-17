import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class ChangePrimaryKey extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(oldRowKey: TPrimaryKey, newRowKey: TPrimaryKey) {

    const rowOps               = this.rowOperations
    const gridRow              = rowOps.GetRow.run(oldRowKey)
    const { primaryColumnKey } = this.gridOperations.source()
    const { cellOperations }   = this
    
    if (!gridRow) return

    // Update value in grid row
    gridRow.setValue(primaryColumnKey, newRowKey)
    gridRow.values.forEach(v => v.rowKey = newRowKey)
    
    // Update row map
    rowOps.rowKeyMap.delete(oldRowKey)
    rowOps.rowKeyMap.set(newRowKey, gridRow)

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
    for (const columnKey of this.gridOperations.source()?.allColumnKeys ?? []) {
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

import { EGridIcon } from '../../services/icon.service'
import { IGridRowComponent, TGridMode } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { Operation } from '../operation.abstract'

export class CheckRowIcon extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(row: IGridRowComponent): void {
    for (const applyIconFn of Object.values(this._iconConditions)) {
      if (applyIconFn(row)) return
    }
    row.icon.next(null)
  }

  public clear(rows: IGridRowComponent[]) {
    for (const r of rows) { this.run(r) }
  }

  // First condition matched will be applied
  private _iconConditions: { [key: string]: (r: IGridRowComponent) => boolean } = {    
    preSelected: (row: IGridRowComponent) => {
      const selection = this._preSelectedRow
      const isPreSelected = this._gridMode === 'SelectMode' && (selection === row.rowKey) 
      if (!isPreSelected) return false
      if (this._rowIsSelected(row)) row.icon.next(EGridIcon.CheckedBox)
      else                          row.icon.next(EGridIcon.CheckBox)
      return true
    },
    selected: (row: IGridRowComponent) => {
      const isSelected = this._rowIsSelected(row)
      if (isSelected) row.icon.next(EGridIcon.Check)
      return isSelected
    },
    deletedRow: (row: IGridRowComponent) => {
      const isDeletedRow = this.rowOperations.GetRowMeta.run(row.rowKey)?.isDeleted === true
      if (isDeletedRow) row.icon.next(EGridIcon.Cross)
      return isDeletedRow
    },
    newRow: (row: IGridRowComponent) => {
      const isNewRow = this.rowOperations.GetRowMeta.run(row.rowKey)?.isNew === true
      if (isNewRow) row.icon.next(EGridIcon.Asterisk)
      return isNewRow
    },
    focused: (row: IGridRowComponent) => {
      const isFocused = this._focused?.isRow(row.rowKey) === true && this._gridMode === 'Standard'
      if (isFocused) row.icon.next(EGridIcon.TriangleArrowRight)
      return isFocused
    },
    draftValue: (row: IGridRowComponent) => {
      let hasDraft = false
      for (const columnKey of row.columns) {
        hasDraft = this.cellOperations.HasDraftValue.run(new GridCellCoordinates(row.rowKey, columnKey))
        if (hasDraft) break
      }
      if (hasDraft) row.icon.next(EGridIcon.EditPen)
      return hasDraft
    }
  }

  private _rowIsSelected(row: IGridRowComponent): boolean {
    const selection = this.selection.latestSelection
    return this._gridMode === 'SelectMode'
      && (selection?.includesRow(row.rowKey) === true || (!selection?.secondarySelection?.isSubtracting && selection?.secondarySelection?.includesRow(row.rowKey) === true)) 
  }

  private get _focused() {
    return this.gridEvents.CellFocusChangedEvent.state
  }

  private get _preSelectedRow() {
    return this.gridEvents.RowPreselectedEvent.state
  }

  private get _gridMode(): TGridMode {
    return this.gridEvents.GridModeChangedEvent.state ?? 'Standard'
  }

}

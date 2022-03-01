import { IGridCellComponent, IGridRowComponent } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { ArrayFromMap } from '../../utils/array-from-map'
import { DistinctValues } from '../../utils/distinct-values'
import { BaseRowOperation } from './base-row-operation.abstract'

export class RowComponents extends BaseRowOperation {

  private readonly rowComponentsByKey = new Map<TPrimaryKey, IGridRowComponent>()

  constructor(factory: IRowOperationFactory) { super(factory) }

  public changePrimaryKey(oldKey: TPrimaryKey, newKey: TPrimaryKey) {
    const row = this.rowComponentsByKey.get(oldKey)
    if (row) {
      this.rowComponentsByKey.delete(oldKey)
      this.rowComponentsByKey.set(newKey, row)
    }
  }

  public added(row: IGridRowComponent) {
    this.rowComponentsByKey.set(row.rowKey, row)
    this._updateRowComponent(row)
  }

  public changed(row: IGridRowComponent, oldRowKey: TPrimaryKey, cells: IGridCellComponent[]) {
    if (this.rowComponentsByKey.get(oldRowKey) === row) this.rowComponentsByKey.delete(oldRowKey)
    this.rowComponentsByKey.set(row.rowKey, row)
    cells.forEach(cell => {
      const oldCoords = new GridCellCoordinates(oldRowKey, cell.columnKey)
      this.cellOperations.CellComponents.changed(cell, oldCoords)
    })
    this._updateRowComponent(row)
  }

  public removed(row: IGridRowComponent) {
    this.rowComponentsByKey.delete(row.rowKey)
  }

  public getAll(): IGridRowComponent[] {
    return DistinctValues(ArrayFromMap(this.rowComponentsByKey))
  }

  public filterWitPrimaryKeyIn(primaryKeys: Set<TPrimaryKey>): IGridRowComponent[] {
    return Array.from(primaryKeys).filter(key => this.rowComponentsByKey.has(key)).map(key => this.rowComponentsByKey.get(key)) as IGridRowComponent[]
  }

  public findWithPrimaryKey(primaryKey?: TPrimaryKey): IGridRowComponent | undefined {
    return typeof primaryKey !== 'undefined' ? this.rowComponentsByKey.get(primaryKey) : undefined
  }

  public override onDestroy() {
    this.rowComponentsByKey.clear()
  }

  private _updateRowComponent(row: IGridRowComponent): void {
    this.rowOperations.SetRowSelectionClasses.run(row)
    this.rowOperations.SetRowFocusedClasses.run(row)
    this.rowOperations.CheckRowIcon.run(row)
  }

}

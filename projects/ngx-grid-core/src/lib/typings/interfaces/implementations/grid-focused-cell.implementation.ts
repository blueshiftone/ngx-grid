import { IGridCellCoordinates, IGridCellFocused } from '..'
import { TColumnKey } from '../../types/column-key.type'
import { TPrimaryKey } from '../../types/primary-key.type'

export class GridFocusedCell implements IGridCellFocused {
  public readonly timeFocused = performance.now();
  constructor(private readonly coords: IGridCellCoordinates) {}
  public isCell(coordinates: IGridCellCoordinates) {
    return this.isRow(coordinates.rowKey) && this.isCol(coordinates.columnKey)
  }
  public isRow(rowKey: TPrimaryKey) {
    return this.rowKey === rowKey
  }
  public isCol(columnKey: TColumnKey) {
    return this.columnKey == columnKey
  }
  public get compositeKey(): string {
    return this.coords.compositeKey
  }
  public get rowKey(): TPrimaryKey {
    return this.coords.rowKey
  }
  public get columnKey(): TColumnKey {
    return this.coords.columnKey
  }
  public equals(other: IGridCellFocused): boolean {
    return this.coords.equals(other)
  }
}

import { IGridCellCoordinates } from '..'
import { TColumnKey, TPrimaryKey } from '../../types'

export class GridCellCoordinates implements IGridCellCoordinates {
  constructor (
    public rowKey   : TPrimaryKey,
    public columnKey: TColumnKey
  ) {}
  public get compositeKey(): string {
    return `${this.columnKey}>${this.rowKey}`
  }
  public equals(other: IGridCellCoordinates): boolean {
    return other.columnKey === this.columnKey && other.rowKey === this.rowKey
  }
}
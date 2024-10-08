import { IGridCellCoordinates, IGridCellValue } from '..'
import { TColumnKey, TPrimaryKey } from '../../types'

export class GridCellValue implements IGridCellValue {

  constructor (
    private readonly coords: IGridCellCoordinates,
    public value : any,
    public isDraft = false,
  ) {}

  public get compositeKey(): string {
    return this.coords.compositeKey
  }
  public get rowKey(): TPrimaryKey {
    return this.coords.rowKey
  }
  public set rowKey(rowKey: TPrimaryKey) {
    this.coords.rowKey = rowKey
  }
  public get columnKey(): TColumnKey {
    return this.coords.columnKey
  }
  public equals(other: IGridCellValue): boolean {
    return this.value === other.value
  }
}

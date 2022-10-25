import { IGridColumnWidths } from '..'
import { TColumnKey } from '../../types'

export class GridColumnWidths implements IGridColumnWidths {
  constructor(
    public columns: Map<TColumnKey, number>,
    public changedOne: string | null
  ) {}
  public getWidth(colKey: string) {
    return this.columns.get(colKey) ?? 0
  }
  public setWidth(columnKey: string, width: number) {
    this.columns.set(columnKey, width)
  }
  public addDistance(columnKey: string, distance: number) {
    const existing = this.getWidth(columnKey)
    this.columns.set(columnKey, existing + distance)
  }
}

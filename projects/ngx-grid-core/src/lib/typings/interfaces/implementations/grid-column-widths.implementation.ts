import { IGridColumnWidth, IGridColumnWidths } from '..'

export class GridColumnWidths implements IGridColumnWidths {
  public columns: IGridColumnWidth[] = [];
  public changedOne: string | null
  constructor(column: IGridColumnWidth[], changed: string | null) {
    this.columns = column
    this.changedOne = changed
  }
  public getWidth(colKey: string) {
    return this.columns.find(c => c.columnKey === colKey)?.width || 0
  }
  public setWidth(columnKey: string, cidth: number) {
    const existing = this.columns.find(c => c.columnKey === columnKey)
    if (existing)
      existing.width = cidth
  }
  public addDistance(columnKey: string, distance: number) {
    const existing = this.columns.find(c => c.columnKey === columnKey)
    if (existing)
      existing.width += distance
  }
}

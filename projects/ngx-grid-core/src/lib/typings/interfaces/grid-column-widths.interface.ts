import { IGridColumnWidth } from './grid-column-width.interface'


export interface IGridColumnWidths {
  columns   : IGridColumnWidth[]
  changedOne: string | null
  getWidth   (ColumnKey: string)                  : number
  setWidth   (ColumnKey: string, Width: number)   : void
  addDistance(ColumnKey: string, Distance: number): void
}

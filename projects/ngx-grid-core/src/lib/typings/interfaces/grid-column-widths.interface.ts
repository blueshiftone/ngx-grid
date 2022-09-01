import { IGridColumnWidth } from './grid-column-width.interface'


export interface IGridColumnWidths {
  columns   : IGridColumnWidth[]
  changedOne: string | null
  getWidth   (columnKey: string)                  : number
  setWidth   (columnKey: string, width: number)   : void
  addDistance(columnKey: string, distance: number): void
}

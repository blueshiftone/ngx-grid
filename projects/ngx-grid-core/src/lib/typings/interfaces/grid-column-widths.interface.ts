import { TColumnKey } from '../types'

export interface IGridColumnWidths {
  columns   : Map<TColumnKey, number>,
  changedOne: string | null
  getWidth   (columnKey: string)                  : number
  setWidth   (columnKey: string, width: number)   : void
  addDistance(columnKey: string, distance: number): void
}

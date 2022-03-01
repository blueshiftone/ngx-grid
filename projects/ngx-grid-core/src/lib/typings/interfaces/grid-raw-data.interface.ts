import { TColumnKey } from '../types'
import { IGridRow } from './grid-row.interface'

export interface IGridRawData {
  columns: TColumnKey[]
  rows: IGridRow[]
}

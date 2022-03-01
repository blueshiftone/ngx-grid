import { TColumnKey } from '../types/column-key.type'
import { TPrimaryKey } from '../types/primary-key.type'
import { IGridSelectionRange } from './grid-selection-range.interface'

export interface IGridSelectionSlice {
  cells         : any[][]
  rows          : any[][]
  cellsFormatted: any[][]
  rowsFormatted : any[][]
  columnKeys    : TColumnKey[]
  rowKeys       : TPrimaryKey[]
  selection     : IGridSelectionRange
}

import { IGridCellValue } from '.'
import { TColumnKey, TPrimaryKey, TRowValues } from '../types'

export interface IGridRow {
  rowKey     : TPrimaryKey
  values     : TRowValues
  valuesArray: { columnKey: TColumnKey, value: IGridCellValue }[]
  getValue(columnKey: TColumnKey): IGridCellValue
  setValue(columnKey: TColumnKey, value: any): void
  clone(): IGridRow
}

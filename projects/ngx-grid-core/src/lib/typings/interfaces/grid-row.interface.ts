import { IGridCellValue, IGridMetadataCollection, IGridSeparator } from '.'
import { ERowStatus } from '../enums'
import { TColumnKey, TPrimaryKey, TRowValues } from '../types'

export interface IGridRow {
  rowKey     : TPrimaryKey
  values     : TRowValues
  valuesArray: { columnKey: TColumnKey, value: IGridCellValue }[]
  separators?: IGridSeparator[]
  isNew      : boolean
  isDeleted  : boolean
  isDirty    : boolean
  status     : ERowStatus
  canDelete  : boolean | null
  canUpdate  : boolean | null
  metadata   : IGridMetadataCollection

  getValue(columnKey: TColumnKey): IGridCellValue
  setValue(columnKey: TColumnKey, value: any): void
  clone(): IGridRow
}

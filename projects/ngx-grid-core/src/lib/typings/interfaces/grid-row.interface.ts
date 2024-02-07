import { BehaviorSubject } from 'rxjs'

import { IGridCellValue, IGridMetadataCollection, IGridSeparator } from '.'
import { ERowStatus } from '../enums'
import { TColumnKey, TPrimaryKey, TRowValues } from '../types'

export interface IGridRow {
  rowKey       : TPrimaryKey
  values       : TRowValues
  valuesArray  : { columnKey: TColumnKey, value: IGridCellValue }[]
  separators?  : IGridSeparator[]
  isNew        : boolean
  isDeleted    : boolean
  isDirty      : boolean
  status       : ERowStatus
  canDelete    : boolean | null
  canUpdate    : boolean | null
  metadata     : IGridMetadataCollection
  floatingTitle: IGridRowFloatingTitle | null

  getValue(columnKey: TColumnKey): IGridCellValue
  setValue(columnKey: TColumnKey, value: any): void
  clone(newPrimaryKey?: TPrimaryKey): IGridRow
  toString(): string
  toJSON<T = { [key: string]: any }>(): T
}

export interface IGridRowFloatingTitle {
  title: BehaviorSubject<string>
  icon : BehaviorSubject<string>
  isGroup?: boolean
  numGroupedRows?: number
  action: () => void
}

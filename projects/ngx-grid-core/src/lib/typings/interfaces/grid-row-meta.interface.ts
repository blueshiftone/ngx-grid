import { IGridMetadataCollection } from '.'
import { ERowStatus } from '../enums/row-status.enum'
import { TPrimaryKey } from '../types'
import { IGridSeparator } from './grid-separator.interface'

export interface IGridRowMeta {
  rowKey     : TPrimaryKey
  separators?: IGridSeparator[]
  isNew      : boolean
  isDeleted  : boolean
  isDirty    : boolean
  status     : ERowStatus
  canDelete  : boolean | null
  canUpdate  : boolean | null
  metadata   : IGridMetadataCollection
}

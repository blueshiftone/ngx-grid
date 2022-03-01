import { IGridMetadataCollection } from '.'
import { ERowStatus } from '../enums/row-status.enum'
import { TPrimaryKey } from '../types'
import { IGridSeperator } from './grid-seperator.interface'

export interface IGridRowMeta {
  rowKey     : TPrimaryKey
  seperators?: IGridSeperator[]
  isNew      : boolean
  isDeleted  : boolean
  isDirty    : boolean
  status     : ERowStatus
  canDelete  : boolean | null
  canUpdate  : boolean | null
  metadata   : IGridMetadataCollection
}

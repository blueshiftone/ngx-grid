import { TPrimaryKey } from '../types'

export interface IGridRecordSelectedEvent {
  rowKey        : TPrimaryKey
  originatedFrom: 'ActionButton' | 'RecordRow'
}

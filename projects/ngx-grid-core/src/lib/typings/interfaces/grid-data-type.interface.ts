import { TCellTypeName } from '../types/cell-type-name.type'
import { IGridSelectList } from './grid-select-list.interface'

export interface IGridDataType {
  name : TCellTypeName
  list?: IGridSelectList
}

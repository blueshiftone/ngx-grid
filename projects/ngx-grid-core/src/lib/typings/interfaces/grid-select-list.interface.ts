import { EGridSelectListType } from '../enums/grid-select-list-type.enum'
import { IGridSelectListOption } from './grid-select-list-option.interface'

export interface IGridSelectList {
  type          : EGridSelectListType
  staticOptions?: IGridSelectListOption[]
  relatedGridID?: string
  color?       : string
}

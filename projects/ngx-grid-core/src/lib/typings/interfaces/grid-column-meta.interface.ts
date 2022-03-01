import { IGridMetadataCollection as IGridMetadataCollection } from '.'
import { IGridDataType } from './grid-data-type.interface'
import { IGridSeperator } from './grid-seperator.interface'

export interface IGridColumnMeta {
  columnKey  : string,
  name?      : string,
  type?      : IGridDataType,
  sortOrder? : number,
  seperators?: IGridSeperator[],
  metadata   : IGridMetadataCollection
}

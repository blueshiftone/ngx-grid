import { IGridMetadataCollection as IGridMetadataCollection } from '.'
import { IGridDataType } from './grid-data-type.interface'
import { IGridSeparator } from './grid-separator.interface'

export interface IGridColumn {
  readonly columnKey  : string,
           name?      : string,
           type?      : IGridDataType,
           sortOrder? : number,
           separators?: IGridSeparator[],
           metadata   : IGridMetadataCollection
}

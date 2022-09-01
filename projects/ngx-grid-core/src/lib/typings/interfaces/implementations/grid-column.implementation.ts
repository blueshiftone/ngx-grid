import { IGridColumn, IGridDataType, IGridMetadataCollection, IGridSeparator } from '..'
import { TColumnKey } from '../../types'
import { GridImplementationFactory } from './grid-implementation.factory'

export class GridColumn implements IGridColumn {

  public name?      : string
  public type?      : IGridDataType
  public sortOrder? : number
  public separators?: IGridSeparator[]
  public metadata   : IGridMetadataCollection

  constructor(public readonly columnKey: TColumnKey) {
    this.metadata = GridImplementationFactory.gridMetadataCollection()
  }

}

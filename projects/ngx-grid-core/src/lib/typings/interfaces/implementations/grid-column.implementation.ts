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

  public clone(): IGridColumn {
    const clone = new GridColumn(this.columnKey)
    clone.name = this.name
    clone.type = this.type
    clone.sortOrder = this.sortOrder
    clone.separators = [...this.separators ?? []]
    clone.metadata = GridImplementationFactory.gridMetadataCollection(this.metadata.items)
    return clone
  }

}

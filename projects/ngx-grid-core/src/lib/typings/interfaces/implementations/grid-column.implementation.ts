import { ComponentType } from '@angular/cdk/portal'
import { BehaviorSubject } from 'rxjs'

import { EColumnIconVisibility, IGridColumn, IGridDataType, IGridMetadataCollection, IGridSeparator } from '..'
import { TColumnKey } from '../../types'
import { GridImplementationFactory } from './grid-implementation.factory'

export class GridColumn implements IGridColumn {

  public name?      : string
  public type?      : IGridDataType
  public sortOrder? : number
  public separators?: IGridSeparator[]
  public metadata   : IGridMetadataCollection

  public dropdownMenu?: {
    icon: BehaviorSubject<string>
    component: ComponentType<any>,
    iconVisibility: BehaviorSubject<EColumnIconVisibility>
  }

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
    clone.dropdownMenu = this.dropdownMenu ? {
      component: this.dropdownMenu.component,
      icon: new BehaviorSubject(this.dropdownMenu.icon.value),
      iconVisibility: new BehaviorSubject(this.dropdownMenu.iconVisibility.value)
    } : undefined
    return clone
  }

}

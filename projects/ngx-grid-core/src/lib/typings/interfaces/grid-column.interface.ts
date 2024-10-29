import { ComponentType } from '@angular/cdk/portal'
import { BehaviorSubject } from 'rxjs'

import { IGridMetadataCollection as IGridMetadataCollection } from '.'
import { IGridDataType } from './grid-data-type.interface'
import { IGridSeparator } from './grid-separator.interface'

export interface IGridColumn {
  readonly columnKey  : string
  name?      : string
  type?      : IGridDataType
  sortOrder? : number
  separators?: IGridSeparator[]
  metadata   : IGridMetadataCollection
  isColumnMenuHidden?  : boolean
  minWidth?  : number
  dropdownMenu?: {
    iconVisibility: BehaviorSubject<EColumnIconVisibility>
    icon: BehaviorSubject<string>
    component: ComponentType<IGridColumnDropdownMenuComponent>
  }
  clone(): IGridColumn
}

export enum EColumnIconVisibility {
  OnHover,
  Always,
}

export interface IGridColumnDropdownMenuComponent {
  column: IGridColumn | undefined
}

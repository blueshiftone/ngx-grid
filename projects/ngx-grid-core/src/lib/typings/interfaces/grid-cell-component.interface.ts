import { BehaviorSubject, Subject } from 'rxjs'

import { IGridCellType as IGridCellTypeComponent } from '.'
import { GridOverlayService } from '../../services/grid-overlay-service.service'
import { IGridColumn } from '../interfaces'
import { TPrimaryKey } from '../types'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'
import { IGridDataType } from './grid-data-type.interface'
import { IGridRowComponent } from './grid-row-component.interface'

export interface IGridCellComponent {
  column        : IGridColumn
  rowComponent  : IGridRowComponent
  coordinates   : IGridCellCoordinates
  focus         : BehaviorSubject<boolean>
  style         : CSSStyleDeclaration
  element       : HTMLElement
  type          : IGridDataType
  destroyed     : Subject<void>
  typeComponent?: IGridCellTypeComponent
  rowKey        : TPrimaryKey
  overlays      : GridOverlayService

  toggleClass   (className: string, classState: boolean): void
  detectChanges ()                                      : void
  setValue      (value: any)                            : void
  startEdit     ()                                      : void
  stopEdit      ()                                      : void
}

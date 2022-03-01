import { BehaviorSubject, Subject } from 'rxjs'

import { IGridCellCoordinates } from '.'
import { GridControllerService } from '../../controller/grid-controller.service'
import { ECellMode } from '../enums/cell-mode.enum'
import { IGridDataType } from './grid-data-type.interface'

export interface IGridCellType {
  focus           : BehaviorSubject<boolean>
  value           : any
  valueChanged    : Subject<void>
  activeNode      : HTMLElement
  displayNode     : HTMLElement
  editableNode    : HTMLElement
  mode            : BehaviorSubject<ECellMode>
  gridController  : GridControllerService
  type            : IGridDataType
  isOpen          : boolean
  isClosed        : boolean
  coordinates     : IGridCellCoordinates
  isEditable      : boolean
  valueHasChanged?: () => boolean

  onDestroy    ()              : void
  open         ()              : IGridCellType
  close        ()              : IGridCellType
  attachTo     (e: HTMLElement): IGridCellType
  setValue     (v: any)        : boolean
  receiveValue (v: any)        : void
}

import { BehaviorSubject } from 'rxjs'

import { IGridRow } from '.'
import { EGridIcon } from '../../services/icon.service'
import { IGridColumn } from '../interfaces'
import { TPrimaryKey } from '../types/primary-key.type'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'

export interface IGridRowComponent {
  gridRow          : IGridRow
  columns          : IGridColumn[]
  index            : number
  icon             : BehaviorSubject<EGridIcon | null>
  firstCellPosition: IGridCellCoordinates
  lastCellPosition : IGridCellCoordinates
  element          : HTMLElement
  rowKey           : TPrimaryKey
  
  toggleClass  (className: string, classState: boolean): void
  detectChanges()                                      : void
}

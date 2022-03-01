import { BehaviorSubject } from 'rxjs'

import { IGridRow } from '.'
import { EGridIcon } from '../../services/icon.service'
import { TColumnKey } from '../types/column-key.type'
import { TPrimaryKey } from '../types/primary-key.type'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'

export interface IGridRowComponent {
  gridRow          : IGridRow
  columns          : TColumnKey[]
  index            : number
  icon             : BehaviorSubject<EGridIcon | null>
  firstCellPosition: IGridCellCoordinates
  lastCellPosition : IGridCellCoordinates
  element          : HTMLElement
  rowKey           : TPrimaryKey
  
  toggleClass  (className: string, classState: boolean): void
  detectChanges()                                      : void
}

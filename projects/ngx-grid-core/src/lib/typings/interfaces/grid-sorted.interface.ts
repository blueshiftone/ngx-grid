import { IGridRow } from '.'
import { ESortDirection } from '../enums/sort-direction.enum'

export interface IGridSorted {
  columnName: string,
  sortOrder : ESortDirection,
  rows?     : IGridRow[] | null
}


import { ESortDirection } from '../enums/sort-direction.enum'

export interface IFieldSortConfig {
  columnName: string,
  direction: ESortDirection
  sortIndex: number
}

import { IGridColumn, IGridRow } from '.'
import { TColumnKey } from '../types/column-key.type'
import { TPrimaryKey } from '../types/primary-key.type'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'
import { IGridCellEdges } from './grid-cell-edges.interface'
import { IGridSelectionBoundingPosition } from './grid-selection-bounding-position.interface'

export interface IGridSelectionRange {
  multiSelect       : boolean
  secondarySelection: IGridSelectionRange | null
  isSubtracting     : boolean
  columns           : Set<TColumnKey>
  rows              : Set<TPrimaryKey>
  cellCount         : number
  getRowIndexes()        : Array<number>
  rowKeys           : Array<TPrimaryKey>
  columnIndexes     : Array<number>
  columnKeys        : Array<TColumnKey>

  clone              ()                                                      : IGridSelectionRange
  includesRow        (rowKey: TPrimaryKey)                                   : boolean
  includesColumn     (columnKey: TColumnKey)                                 : boolean
  includes           (coordinates: IGridCellCoordinates)                     : boolean
  edgesOf            (coordinates: IGridCellCoordinates)                     : IGridCellEdges
  add                (coordinates: IGridCellCoordinates)                     : IGridSelectionRange
  remove             (coordinates: IGridCellCoordinates)                     : IGridSelectionRange
  getRange           (start: IGridCellCoordinates, end: IGridCellCoordinates): IGridCellCoordinates[]
  addRange           (start: IGridCellCoordinates, end: IGridCellCoordinates): IGridSelectionRange
  toggleRange        (start: IGridCellCoordinates, end: IGridCellCoordinates): IGridSelectionRange
  removeRange        (start: IGridCellCoordinates, end: IGridCellCoordinates): IGridSelectionRange
  isEqual            (s: IGridSelectionRange | null)                         : boolean
  rowsAt             (columnKey: TColumnKey)                                 : Set<TPrimaryKey>
  colsAt             (rowKey: TPrimaryKey)                                   : Set<TColumnKey>
  allCellCoordinates ()                                                      : IGridCellCoordinates[]
  changePrimaryKey   (oldKey: TPrimaryKey, newKey: TPrimaryKey)              : void

  coordinatesAt      : {
    topLeft    : () => IGridCellCoordinates
    topRight   : () => IGridCellCoordinates
    bottomRight: () => IGridCellCoordinates
    bottomLeft : () => IGridCellCoordinates
  }
  
  getBounds (): {
    topLeft    : IGridSelectionBoundingPosition
    topRight   : IGridSelectionBoundingPosition
    bottomRight: IGridSelectionBoundingPosition
    bottomLeft : IGridSelectionBoundingPosition
  }

  globalUtils: {
    getRowKeyFromIndex   : (rowIndex: number)                         => TPrimaryKey | undefined,
    getColumnKeyFromIndex: (columIndex: number)                       => IGridColumn,
    getRowIndex          : (rowKey: TPrimaryKey)                      => number,
    getRowFromRowKey     : (rowKey: TPrimaryKey)                      => IGridRow | undefined,
    getColumnIndex       : (columnKey: string)                        => number,
    getFirstColumn       : ()                                         => IGridColumn,
    getLastColumn        : ()                                         => IGridColumn,
    getFirstRow          : ()                                         => TPrimaryKey,
    getLastRow           : ()                                         => TPrimaryKey,
    incrementColumn      : (columnKey: TColumnKey, increment: number) => TColumnKey,
    incrementRow         : (rowKey: TPrimaryKey, increment: number)   => TPrimaryKey
  }
}

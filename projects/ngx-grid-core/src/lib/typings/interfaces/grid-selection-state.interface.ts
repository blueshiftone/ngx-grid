import { ESelectMode } from '../enums/select-mode.enum'
import { ESelectionType } from '../enums/selection-type.enum'
import { IGridCellCoordinates } from './grid-cell-coordinates.interface'
import { IGridCellFocused } from './grid-cell-focused'
import { IGridSelectionModifiers } from './grid-selection-modifiers.interface'
import { IGridSelectionRange } from './grid-selection-range.interface'

export interface IGridSelectionState {
  readonly hasShiftKey       : boolean
  readonly hasCtrlKey        : boolean
  readonly hasModifiers      : boolean
  readonly hasFocusedCell    : boolean
  readonly isRowSelection    : boolean
  readonly isCellSelection   : boolean
  readonly isColumnSelection : boolean
  readonly isAdding          : boolean
  readonly isSubtracting     : boolean
           focusedCell?      : IGridCellFocused
           previousSelection?: IGridSelectionRange,
           initialSelection  : IGridSelectionRange,
           currentSelection  : IGridSelectionRange
           startCellPos      : IGridCellCoordinates
           endCellPos        : IGridCellCoordinates
           type              : ESelectionType
           mode              : ESelectMode

  setModifiers(modifiers: IGridSelectionModifiers): void
}



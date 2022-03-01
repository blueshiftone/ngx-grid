import { ESelectionType, ESelectMode } from '../../../typings/enums'
import {
  IGridCellComponent,
  IGridCellCoordinates,
  IGridCellFocused,
  IGridSelectionModifiers,
  IGridSelectionRange,
  IGridSelectionState,
} from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { TAtLeast } from '../../../typings/types/at-least.type'
import { HasParentOfClass } from '../../../utils/find-parent-element-of-class'

export class GridSelectionStateFromEvent implements IGridSelectionState {

  public focusedCell?      : IGridCellFocused = undefined
  public previousSelection?: IGridSelectionRange
  public initialSelection  : IGridSelectionRange
  public currentSelection: IGridSelectionRange
  public startCellPos      : IGridCellCoordinates
  public endCellPos        : IGridCellCoordinates
  public type              : ESelectionType = ESelectionType.Cell
  public mode              : ESelectMode    = ESelectMode.Add

  private _shiftKey = false
  private _ctrlKey = false

  constructor(
    e: TAtLeast<MouseEvent, 'ctrlKey' | 'shiftKey' | 'target'>,
    input: TAtLeast<IGridSelectionState, 'initialSelection' | 'focusedCell'>,
    cellStartedAt: IGridCellComponent
  ) {
    Object.assign(this, input)

    this._shiftKey        = e.shiftKey
    this._ctrlKey         = (e.ctrlKey || e.metaKey) === true
    this.initialSelection = input.initialSelection
    this.currentSelection = this.initialSelection.clone()
    
    const startCellPos = new GridCellCoordinates(cellStartedAt.rowKey, cellStartedAt.columnKey)
    
    this.startCellPos = startCellPos
    this.endCellPos   = startCellPos
    
    if (HasParentOfClass('row-thumb', e.target as HTMLElement))
      this.type = ESelectionType.Row

  }

  public setModifiers(modifiers: IGridSelectionModifiers): void {
    this._shiftKey = modifiers.shiftKey
    this._ctrlKey  = modifiers.ctrlKey
  }

  public get hasShiftKey()      : boolean { return this._shiftKey }
  public get hasCtrlKey()       : boolean { return this._ctrlKey }
  public get hasModifiers()     : boolean { return this.hasCtrlKey || this.hasShiftKey }
  public get hasFocusedCell()   : boolean { return typeof this.focusedCell !== 'undefined' }
  public get isCellSelection()  : boolean { return this.type === ESelectionType.Cell }
  public get isRowSelection()   : boolean { return this.type === ESelectionType.Row }
  public get isColumnSelection(): boolean { return this.type === ESelectionType.Column }
  public get isAdding()         : boolean { return this.mode === ESelectMode.Add }
  public get isSubtracting()    : boolean { return this.mode === ESelectMode.Subtract }

}

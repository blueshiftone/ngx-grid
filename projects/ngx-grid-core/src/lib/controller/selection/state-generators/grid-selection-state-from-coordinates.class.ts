import { IGridEventsFactory } from '../../../events/grid-events.service'
import { ESelectMode } from '../../../typings/enums/select-mode.enum'
import { ESelectionType } from '../../../typings/enums/selection-type.enum'
import {
  IGridCellCoordinates,
  IGridCellFocused,
  IGridSelectionModifiers,
  IGridSelectionRange,
  IGridSelectionState,
} from '../../../typings/interfaces'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'

export class GridSelectionStateFromCoordinates implements IGridSelectionState {

  public focusedCell?      : IGridCellFocused     = undefined
  public previousSelection?: IGridSelectionRange
  public initialSelection  : IGridSelectionRange
  public currentSelection  : IGridSelectionRange
  public type              : ESelectionType       = ESelectionType.Cell
  public mode              : ESelectMode          = ESelectMode.Add

  constructor(
    public  startCellPos   : IGridCellCoordinates,
    public  endCellPos     : IGridCellCoordinates,
    private readonly events: IGridEventsFactory,
    input? : Partial<IGridSelectionState>,
    private _ctrlKey       : boolean = false,
    private _shiftKey      : boolean = false,
  ) {
    Object.assign(this, input)

    this.initialSelection = input?.initialSelection || GridImplementationFactory.gridSelectionRange(this.events)
    this.currentSelection = this.initialSelection.clone()

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

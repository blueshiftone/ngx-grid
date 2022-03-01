import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { Subscription } from 'rxjs'

import { IGridEventsFactory } from '../../events/grid-events.service'
import {
  IGridCellCoordinates,
  IGridKeyboardEvent,
  IGridSelectionRange,
  IGridSelectionState,
  IGridSelectionStrategy,
  IMoveSelectionFromFocusConfigs,
} from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { TAtLeast } from '../../typings/types/at-least.type'
import { GridControllerService } from '../grid-controller.service'
import {
  AddSecondarySelectionOperation,
  AddSelectionOperation,
  CalculateNextSelectionOperation,
  ClearSelectionOperation,
  CopySelectionOperation,
  CreateSelectionStateFromCoordinatesOperation,
  CreateSelectionStateFromMouseEventOperation,
  EmitFocusedCellOperation,
  EmitNextSelectionOperation,
  EmitNextSelectionSliceOperation,
  ExpandToRowOperation,
  GetFinalSelectionOperation,
  GetLastColumnIndexOperation,
  GetLastRowIndexOperation,
  GetSelectionSliceOperation,
  MoveSelectionFromFocusOperation,
  PreselectRowsOperation,
  RemoveOrphanedRowsOperation,
  ReplaceSelectionOperation,
  ScrollIntoViewOperation,
  SelectAllOperation,
  SelectCellOperation,
  SelectRangeOperation,
  SelectRowOperation,
  StartMultiSelectOperation,
  StartShiftSelectOperation,
  SubtractSelectionOperation,
  ToggleSelectionOperation,
  UpdateFocusedCellOperation,
} from './operations'
import { TSelectionStrategies } from './strategies'

export class GridSelectionController {

  private _subscriptions: Subscription[] = []
  private _gridViewPort?: CdkVirtualScrollViewport
  
  public strategy?: IGridSelectionStrategy
  public readonly gridEvents: IGridEventsFactory

  public state: IGridSelectionState | null = null

  public keyboardEvents: {
    arrowUp?    (e: IGridKeyboardEvent): void
    arrowRight? (e: IGridKeyboardEvent): void
    arrowDown?  (e: IGridKeyboardEvent): void
    arrowLeft?  (e: IGridKeyboardEvent): void
    pageUp?     (e: IGridKeyboardEvent): void
    pageDown?   (e: IGridKeyboardEvent): void
    home?       (e: IGridKeyboardEvent): void
    end?        (e: IGridKeyboardEvent): void
    ctrlA?      (e: IGridKeyboardEvent): void
    tab?        (e: IGridKeyboardEvent): void
    enter?      (e: IGridKeyboardEvent): void
    space?      (e: IGridKeyboardEvent): void
    any?        (e: IGridKeyboardEvent): void
  } = {}

  constructor(
    public readonly gridController: GridControllerService,
    public readonly rowOperations : IRowOperationFactory
  ) {
    this.gridEvents = gridController.gridEvents
    this.addSubscription(this.gridEvents.GridKeyCmdPressedEvent.on().subscribe(e => {
      switch(e?.key) {
        case 'ArrowUp'   : this.keyboardEvents.arrowUp?.(e); break
        case 'ArrowRight': this.keyboardEvents.arrowRight?.(e); break
        case 'ArrowDown' : this.keyboardEvents.arrowDown?.(e); break
        case 'ArrowLeft' : this.keyboardEvents.arrowLeft?.(e); break
        case 'PageUp'    : this.keyboardEvents.pageUp?.(e); break
        case 'PageDown'  : this.keyboardEvents.pageDown?.(e); break
        case 'Home'      : this.keyboardEvents.home?.(e); break
        case 'End'       : this.keyboardEvents.end?.(e); break
        case 'Ctrl+A'    : this.keyboardEvents.ctrlA?.(e); break
        case 'Tab'       : this.keyboardEvents.tab?.(e); break
        case 'Enter'     : this.keyboardEvents.enter?.(e); break
        case 'Space'     : this.keyboardEvents.space?.(e); break
      }
      if (e) this.keyboardEvents.any?.(e);
    }))
  }

  public readonly initialise = (strategy: TSelectionStrategies) => {
    this.onDestroy()
    this.strategy = new strategy(this)
    if (this._gridViewPort) this.attachGridBody(this._gridViewPort)
  }

  public readonly attachGridBody = (viewPort: CdkVirtualScrollViewport) => {
    this._gridViewPort = viewPort
    this.strategy?.attach(viewPort.elementRef.nativeElement)
  }

  public readonly createStateFromMouseEvent = (event: TAtLeast<MouseEvent, 'ctrlKey' | 'shiftKey' | 'target'>) => new CreateSelectionStateFromMouseEventOperation(this).run(event)

  public readonly createStateFromCoordinates = (
    coordinates: [IGridCellCoordinates, IGridCellCoordinates],
    input?: Partial<IGridSelectionState>,
    ctrlKey?: boolean,
    shiftKey?: boolean
  ) => new CreateSelectionStateFromCoordinatesOperation(this).run(coordinates, input, ctrlKey, shiftKey)
  
  public readonly expandToRow        = () => new ExpandToRowOperation       (this).run()
  public readonly emitFocusedCell    = () => new EmitFocusedCellOperation   (this).run()
  public readonly selectAll          = () => new SelectAllOperation         (this).run()
  public readonly startShiftSelect   = () => new StartShiftSelectOperation  (this).run()
  public readonly startMultiSelect   = () => new StartMultiSelectOperation  (this).run()
  public readonly updateFocusedCell  = () => new UpdateFocusedCellOperation (this).run()
  public readonly getSelectionSlice  = () => new GetSelectionSliceOperation (this).run()
  public readonly getFinalSelection  = () => new GetFinalSelectionOperation (this).run()
  public readonly getLastColumnIndex = () => new GetLastColumnIndexOperation(this).run()
  public readonly getLastRowIndex    = () => new GetLastRowIndexOperation   (this).run()
  public readonly copySelection      = () => new CopySelectionOperation     (this).run()
  public readonly removeOrphanedRows = () => new RemoveOrphanedRowsOperation(this).run()
  public readonly clearSelection     = () => new ClearSelectionOperation(this).run()
  
  public readonly selectRow   = (rowKey: TPrimaryKey)                                    => new SelectRowOperation(this).run(rowKey)
  public readonly selectCell  = (coords: IGridCellCoordinates)                           => new SelectCellOperation(this).run(coords)
  public readonly selectRange = (start: IGridCellCoordinates, end: IGridCellCoordinates) => new SelectRangeOperation(this).run(start, end)
  
  public readonly addSelection           = (selection?: IGridSelectionRange, from?: IGridCellCoordinates, to?: IGridCellCoordinates) => new AddSelectionOperation          (this).run(selection, from, to)
  public readonly subtractSelection      = (selection?: IGridSelectionRange, from?: IGridCellCoordinates, to?: IGridCellCoordinates) => new SubtractSelectionOperation     (this).run(selection, from, to)
  public readonly addSecondarySelection  = (selection?: IGridSelectionRange, from?: IGridCellCoordinates, to?: IGridCellCoordinates) => new AddSecondarySelectionOperation (this).run(selection, from, to)
  public readonly toggleSelection        = (selection?: IGridSelectionRange, from?: IGridCellCoordinates, to?: IGridCellCoordinates) => new ToggleSelectionOperation       (this).run(selection, from, to)
  public readonly calculateNextSelection = (selection?: IGridSelectionRange, from?: IGridCellCoordinates, to?: IGridCellCoordinates) => new CalculateNextSelectionOperation(this).run(selection, from, to)
  public readonly replaceSelection       = (coordinates: [IGridCellCoordinates, IGridCellCoordinates])                               => new ReplaceSelectionOperation      (this).run(coordinates)
  
  public readonly emitNextSelection      = (selection: IGridSelectionRange | null) => new EmitNextSelectionOperation(this).run(selection)
  public readonly emitNextSelectionSlice = ()                                      => new EmitNextSelectionSliceOperation(this).run()
  
  public readonly preselectRows = (keys: (string | number)[]) => new PreselectRowsOperation(this).run(keys)

  public readonly scrollIntoView = (pos?: IGridCellCoordinates)   => new ScrollIntoViewOperation(this).run(pos)

  public readonly moveSelectionFromFocus = (configs: IMoveSelectionFromFocusConfigs) => new MoveSelectionFromFocusOperation(this).run(configs)

  public get pageSize(): number {
    return Math.floor((this._gridViewPort?.getViewportSize() || 0) / 25)
  }

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  public addSubscription(s: Subscription): void {
    this._subscriptions.lastIndexOf(s)
  }

  public get latestSelection() {
    return this.gridEvents.CellSelectionChangedEvent.state
  }

}

import { fromEvent, Subscription } from 'rxjs'
import { filter, map, repeat, take } from 'rxjs/operators'

import { EMetadataType } from '../../typings/enums'
import { IGridCellComponent, IGridCellFocused, IGridKeyboardEvent, IGridOperationFactory, INumberOptions } from '../../typings/interfaces'
import { CELL_VALUE_PARSERS } from '../../ui/cell/cell-types/value-parsing'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'
import { FindParentOfClass } from '../../utils/find-parent-element-of-class'
import { Operation } from '../operation.abstract'

export class ViewportSetupEditTriggers extends Operation {

  private readonly subscriptions: Set<Subscription> = new Set()

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(): void {
    this._reset()
    this._setupClickTrigger()
    this._setupKeyboardTriggers()
  }

  public override onDestroy = () => this.subscriptions.forEach(s => s.unsubscribe())
  private _reset = () => this.onDestroy()

  private _setupClickTrigger(): void {

    const { viewPort } = this.gridOperations
    if (!viewPort) return

    this.subscriptions.add(
      fromEvent<PointerEvent>(viewPort.elementRef.nativeElement, 'click')
      .pipe(filter       (e => e.timeStamp - (this._focusedCell?.timeFocused || 0) > 150),
            map          (e => this._getComponentFromTarget(e?.target)),
            filter       (e => e?.coordinates.rowKey === this._focusedCell?.rowKey && e?.coordinates.columnKey === this._focusedCell?.columnKey),
            filter       (e => !this._editingCell || e !== this._editingCell),
            removeNullish(),
            take         (1),
            repeat       ())
      .subscribe(cell => this._emitEdit(cell))
    )
  }

  private _setupKeyboardTriggers(): void {
    this.subscriptions.add(this.gridEvents.GridKeypressedEvent.on().subscribe(e => {
      const focusedComponent = this.cellOperations.GetFocusedCell.run()
      if (!focusedComponent || !e || !focusedComponent.element.classList.contains('is-editable')) return
      if (this._editingCell && this._editingCell === focusedComponent) return
      let validationResult = CELL_VALUE_PARSERS[focusedComponent.type.name].validate(e.valueOfKey, this.controller, focusedComponent.coordinates)
      if (validationResult.isValid) {

        // If cell type is a number and has a scale factor, then scale down the value before setting it
        // TODO: this should be handled somewhere else as this logic is duplicated in the number cell type class
        if (focusedComponent.type.name === 'Number') {
          const numberOptions = this.cellOperations.GetCellMetaValue.run<INumberOptions>(focusedComponent.coordinates, EMetadataType.NumberOptions)
          if (numberOptions?.scaleFactor) {
            validationResult.transformedValue /= numberOptions.scaleFactor
          }
        }

        focusedComponent.typeComponent?.setValue(validationResult.transformedValue)

        this.cellOperations.SetCellDraftValue.buffer(focusedComponent.coordinates)
        
      }
      this._emitEdit(focusedComponent, validationResult.isValid ? undefined : e)
    }))

    this.subscriptions.add(this.gridEvents.GridKeyCmdPressedEvent.on().subscribe(e => {
      const focusedComponent = this.cellOperations.GetFocusedCell.run()      
      if (focusedComponent && e?.key === 'Enter') this._emitEdit(focusedComponent)
    }))
  }

  private _getComponentFromTarget(target: EventTarget | undefined | null): IGridCellComponent | undefined {
    const cellElement = FindParentOfClass('cell', target as HTMLElement)
    if (!cellElement) return undefined
    return this.cellOperations.CellComponents.findForElement(cellElement)
  }

  private get _focusedCell(): IGridCellFocused | undefined {
    return this.gridEvents.CellFocusChangedEvent.state
  }

  private get _editingCell(): IGridCellComponent | undefined {
    return this.gridEvents.EditingCellChangedEvent.state ?? undefined
  }

  private _emitEdit(cell: IGridCellComponent, event?: IGridKeyboardEvent): void {  
    this.gridEvents.KeyPressPassedThroughEvent.emit(event ?? null)
    this.gridEvents.EditingCellChangedEvent.emit(cell)
  }

}

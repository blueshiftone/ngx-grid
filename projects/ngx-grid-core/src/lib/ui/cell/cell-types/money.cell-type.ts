import { BehaviorSubject } from 'rxjs'
import { startWith } from 'rxjs/operators'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class MoneyCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly editableCssClassName = 'money-editable'
  private readonly readonlyCssClassName = 'money-readonly'
  private readonly decimalPlaces        = 2

  private _displayNode?: HTMLElement
  private _editableNode?: HTMLElement
  private _valueNode?: HTMLElement
  private _currencySymbolNode: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) {
    super(overlayService, parentCell, gridController)

    this._currencySymbolNode = this.createDiv('sign')
    this.subscriptions.add(this.gridController.localize.changes.pipe(startWith(null)).subscribe(_ => {
      this._currencySymbolNode.innerText = this._currencySymbol
    }))
  }

  public get displayNode() { return this._displayNode || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._valueNode) return;
    this._valueNode.innerText = this._displayValue
    if (this._currencySymbolNode) {
      this._currencySymbolNode.style.display = value === null ? 'none' : ''
    }
  }

  private _generateDisplayNode(): HTMLElement {
    const outerNode = this.createDiv(this.readonlyCssClassName)
    this._valueNode = this.createDiv('value')
    outerNode.appendChild(this._currencySymbolNode)
    outerNode.appendChild(this._valueNode)
    this.receiveValue()
    return this._displayNode = outerNode
  }

  private _generateEditableNode(): HTMLElement {
    const [node] = this.createBasicInput('number', this.editableCssClassName)
    return this._editableNode = node
  }

  private get _currencySymbol(): string {
    return this.gridController.localize.getLocalizedString('$')
  }

  private get _displayValue(): string {
    if (this.value === null) return ''
    if (typeof this.value !== 'number') return this.value
    const bits = this.value.toFixed(this.decimalPlaces).toString().split('.')
    return `${parseInt(bits[0] || '0').toLocaleString(this.gridController.localize.culture)}.${(bits[1] || '').padEnd(this.decimalPlaces, '0')}`
  }

  public override setValue(value: any): boolean {
    if (value === '') value = null
    return super.setValue(value)
  }

}

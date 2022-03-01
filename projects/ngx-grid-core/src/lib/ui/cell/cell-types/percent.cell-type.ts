import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class PercentCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly editableCssClassName = 'percent-editable'
  private readonly readonlyCssClassName = 'percent-readonly'
  private readonly decimalPlaces        = 0

  private _displayNode? : HTMLElement
  private _editableNode?: HTMLElement
  private _valueNode?   : HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }
  
  public get displayNode()  { return this._displayNode  || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._valueNode) return;
    this._valueNode.innerText = this._displayValue
  }

  private _generateDisplayNode(): HTMLElement {
    const outerNode = this.createDiv(this.readonlyCssClassName)
    this._valueNode = this.createDiv('value')
    const signNode  = this.createDiv('sign')
    signNode.innerText = '%'
    outerNode.appendChild(this._valueNode)
    outerNode.appendChild(signNode)
    this.receiveValue()
    return this._displayNode = outerNode
  }

  private _generateEditableNode(): HTMLElement {
    const [node, input] = this.createBasicInput('number', this.editableCssClassName)
    input.step = '0.01'
    return this._editableNode = node
  }

  private get _displayValue(): string {
    let val = typeof this.value === 'number' ? this.value : parseFloat(this.value)
    const bits = (val * 100).toFixed(this.decimalPlaces).toString().split('.').map(v => v === 'NaN' ? '0' : v)
    return `${bits[0] ?? '0'}${this.decimalPlaces ? '.' : ''}${(bits[1] ?? '').padEnd(this.decimalPlaces, '0')}`
  }

}

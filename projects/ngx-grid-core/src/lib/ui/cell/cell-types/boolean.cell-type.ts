import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class BooleanCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Editable)

  private readonly cssClassName = 'boolean'

  private _outerNode?   : HTMLElement
  private _checkboxNode?: HTMLInputElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) {
    super(overlayService, parentCell, gridController)
  }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._checkboxNode) return
    this._checkboxNode.checked  = value ? true : false
    this._checkboxNode.value    = value ? 'on' : 'off'
    this._checkboxNode.disabled = !this.isEditable
  }
  
  public get displayNode()  {
    return this._getOuterNode()
  }
  public get editableNode() { return this._getOuterNode() }

  private _getOuterNode(): HTMLElement {
    if (!this._outerNode) {
      this._outerNode = this.createDiv(this.cssClassName)
      this._outerNode.append(this._getCheckboxNode())
      this.receiveValue()
    }
    return this._outerNode
  }

  private _getCheckboxNode(): HTMLInputElement {
    if (!this._checkboxNode) {
      this._checkboxNode         = document.createElement('input')
      this._checkboxNode.type    = 'checkbox'
      this._checkboxNode.onclick = e => this.setValue((e.target as HTMLInputElement).checked)
      this._checkboxNode.disabled = !this.isEditable
      this.subscriptions.add(this.gridController.gridEvents.MetadataChangedEvent.on().subscribe(_ => {
        if (!this._checkboxNode) return
        this._checkboxNode.disabled = !this.isEditable
      }))
    }
    return this._checkboxNode
  }

  public override measureWidth(): number {
    return 35
  }

}

import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { BaseExpandableCellType } from './abstractions/base-expandable-cell-type.abstract'

export class RichTextCellType extends BaseExpandableCellType {

  public mode                    = new BehaviorSubject<ECellMode>(ECellMode.Readonly)
  public expandableComponentType = EGridOverlayType.RichTextCellPreview

  private readonly readonlyCssClassName = 'rich-text-readonly'

  private _displayNode?: HTMLElement
  private _editableNode?: HTMLElement
  private _textNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }
  
  public get displayNode()  { return this._displayNode  || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return
    this._displayNode.innerHTML = value // TODO: sanitise value for security
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this._textNode  = this.createDiv('value')
    this._displayNode.appendChild(this._textNode)
    this.receiveValue()    
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    return this.displayNode
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const plainText = new DOMParser().parseFromString(this.value, 'text/html').body.innerText
    return CharacterSizer.measure(plainText, this.getFont(), this.maxWidth)
  }

}

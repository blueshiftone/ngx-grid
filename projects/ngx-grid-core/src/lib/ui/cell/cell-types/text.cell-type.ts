import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class TextCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)
  
  private readonly editableCssClassName = 'text-editable'
  private readonly readonlyCssClassName = 'text-readonly'

  private _displayNode?: HTMLElement
  private _editableNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }
  

  public get displayNode()  { return this._displayNode  || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    const hideValue = this.gridController.cell.GetCellMeta.run(this.parentCell.coordinates).metadata.get<boolean>(EMetadataType.HideValue)
    if (hideValue) value = null
    super.receiveValue(value)
    if (!this._displayNode) return;
    this._displayNode.innerText = value
  }

  private _generateDisplayNode(): HTMLElement {
    const node = this.createDiv(this.readonlyCssClassName)
    this._displayNode = node
    this.receiveValue()
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    const [node] = this.createBasicInput('text', this.editableCssClassName)
    return this._editableNode = node
  }

}

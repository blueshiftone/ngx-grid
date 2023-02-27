import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
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
    super.receiveValue(value)
    if (!this._displayNode) return;
    const valueLocalizationKey = this.gridController.cell.GetCellMetaValue.run<string>(this.coordinates, EMetadataType.ValueLocalizationKey)
    if (valueLocalizationKey !== null) {
      const localizedValue = this.gridController.localize.getLocalizedString(valueLocalizationKey)
      if (localizedValue !== valueLocalizationKey) {
        value = localizedValue
      }
    }
    this._displayNode.innerText = value
  }

  private _generateDisplayNode(): HTMLElement {
    const node = this.createDiv(this.readonlyCssClassName)
    this._displayNode = node
    this.receiveValue()
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    const [node] = this.createBasicInput({ type: 'text', cssClass: this.editableCssClassName })
    return this._editableNode = node
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const additionalPadding = 7
    return CharacterSizer.measure(this.value, this.getFont(), this.maxWidth) + additionalPadding
  }

}

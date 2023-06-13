import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { BaseCellType } from './abstractions/base-cell-type.abstract'
import { IButtonCellValue } from '../../../typings/interfaces/button-cell-value.interface'

export class ButtonCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode ?? this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: IButtonCellValue | null = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return;
    const localizedLabel = this.gridController.localize.getLocalizedString(value?.text  ?? '')
    this._displayNode.innerText = localizedLabel
    if (!value) this._displayNode.style.display = 'none'
    else this._displayNode.style.display = ''
  }

  private _generateDisplayNode(): HTMLElement {
    const node = document.createElement('button')
    node.classList.add('grid-cell-button')
    this._displayNode = node
    this.receiveValue()
    node.onclick = () => {
      const val = this.value as IButtonCellValue
      val.action(this.parentCell.coordinates)
    }
    return this._displayNode
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const additionalPadding = 18
    return CharacterSizer.measure(this.value.text, this.getFont(), this.maxWidth) + additionalPadding
  }

}

import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'
import { IIconCellValue } from '../../../typings/interfaces/icon-cell-value.interface'

export class IconCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode ?? this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: IIconCellValue | null = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return;
    else 
    {
      this._displayNode.innerText = value?.key ?? ''
      this._displayNode.style.fontSize = value?.size + 'px'
    }
    if (!value) this._displayNode.style.display = 'none'
    else this._displayNode.style.display = ''
  }

  private _generateDisplayNode(): HTMLElement {
    const node = document.createElement('span')
    node.classList.add(this.gridController.iconClass)
    this._displayNode = node
    this.receiveValue()
    return this._displayNode
  }

  public override measureWidth(): number {
    return this.value?.size ?? 0
  }

}

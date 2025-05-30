import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'
import { CharacterSizer } from '../../../utils/character-sizer'

export class FileSizeCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode ?? this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: number | null = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return;
    else 
    {
      this._displayNode.innerText = this._formatBytes(value)
    }
    if (value == null) this._displayNode.style.display = 'none'
    else this._displayNode.style.display = ''
  }

  private _generateDisplayNode(): HTMLElement {
    const node = document.createElement('span')
    this._displayNode = node
    this.receiveValue()
    return this._displayNode
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const additionalPadding = 7
    return CharacterSizer.measure(this._formatBytes(this.value), this.getFont(), this.maxWidth) + additionalPadding
  }

  private _formatBytes(bytes: number | null): string {
    if (bytes === null) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

}

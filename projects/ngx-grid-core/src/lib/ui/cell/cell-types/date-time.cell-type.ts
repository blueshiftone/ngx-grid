import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums'
import { IGridCellComponent } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class DateTimeCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly readonlyCssClassName = 'datetime-readonly'

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode  ?? this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return
    this._displayNode.innerText = this._displayValue
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private get _displayValue(): string {
    return this.gridController.cell.GetFormattedValue.getHTML(this.coordinates, this.value)
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const additionalWidth = 17
    const formattedVal = this.gridController.cell.GetFormattedValue.getPlainText(this.coordinates, this.value)
    return CharacterSizer.measure(formattedVal, this.getFont(), this.maxWidth) + additionalWidth
  }

}

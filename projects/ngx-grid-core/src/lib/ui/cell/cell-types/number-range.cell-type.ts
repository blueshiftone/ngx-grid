import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent, INumberOptions } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { NumberOptionsParser } from '../../../utils/number-format-parser/number-options-parser'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

// This is a read-only cell type
export class NumberRangeCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly readonlyCssClassName = 'number-readonly'

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode  || this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return;
    this._displayNode.innerHTML = this._displayValue
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private get _displayValue(): string {
    if (this.value === null) return ''
    if (!Array.isArray(this.value)) return this.value.toString()
    let val = this.value.map(v => typeof v === 'number' ? v : parseFloat(v)) as number[]
    const numberOptions = this.gridController.cell.GetCellMetaValue.run<INumberOptions>(this.coordinates, EMetadataType.NumberOptions)
    if (numberOptions !== null) {
      // remove greedy spacer by replacing '* ' with '' in the format string'
      // also remove the dash spacer by replacing '_-' with ''
      numberOptions.formatString = numberOptions.formatString?.replace(/\* /g, '').replace(/_-/g, '')
      return val.map(v => NumberOptionsParser.getParser(numberOptions).getHtml(v)).join('<span class="txt-str"> — </span>')
    } else {
      return val.join(' - ')
    }
  }

  public override setValue(value: any): boolean {
    if (value === '') value = null
    return super.setValue(value)
  }

  public override measureWidth(): number {
    if (!this.value || !Array.isArray(this.value)) return 0
    const formattedVal = this.gridController.cell.GetFormattedValue.getPlainText(this.coordinates, this.value)
    return CharacterSizer.measure(formattedVal, this.getFont(), this.maxWidth)
  }

}

import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums'
import { IGridCellComponent, IGridCellType } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { ParseDate } from '../../../utils/parse-date-string'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

// This is a read-only cell type
export class DateRangeCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly readonlyCssClassName = 'date-readonly'

  private _displayNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode ?? this._generateDisplayNode() }
  public get editableNode() { return this.displayNode }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return
    this._displayNode.innerText = this._displayValue
  }

  public override open(): IGridCellType {
    return this
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private get _displayValue(): string {
    const dates = [ParseDate(this.value?.[0]), ParseDate(this.value?.[0])]
    return dates.map(date => (date && this.gridController.datePipe.transform(date, this._dateFormat)) ?? date).join(' — ')
  }

  private get _dateFormat(): string {
    const format = this.gridController.localize.getLocalizedString('dateFormat')
    return format === 'dateFormat' ? this.gridController.getDateFormat() : format
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const formattedVal = this.gridController.cell.GetFormattedValue.getPlainText(this.coordinates, this.value)
    return CharacterSizer.measure(formattedVal, this.getFont(), this.maxWidth)
  }

}

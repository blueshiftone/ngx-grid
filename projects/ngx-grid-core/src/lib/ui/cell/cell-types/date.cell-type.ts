import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode, EPositionPreference } from '../../../typings/enums'
import { IGridCellComponent, IGridCellType } from '../../../typings/interfaces'
import { ParseDate } from '../../../utils/parse-date-string'
import { EGridOverlayTypes } from '../../grid-overlays/grid-overlay-types'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class DateCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly readonlyCssClassName = 'date-readonly'

  private _displayNode?: HTMLElement
  private _editableNode?: HTMLElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode()  { return this._displayNode  ?? this._generateDisplayNode() }
  public get editableNode() { return this._editableNode ?? this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return
    this._displayNode.innerText = this._displayValue
  }

  public override open(): IGridCellType {
    if (!this.isEditable) return this
    this.openOverlay(EGridOverlayTypes.DateEditorOverlay, {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.VerticalBottom
    }).afterClosed.then(_ => {
      this.gridController.gridEvents.EditingCellChangedEvent.emit(null)
      this.close()
    })
    return this
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    return this.displayNode
  }

  private get _displayValue(): string {
    const date = ParseDate(this.value)
    return (date && this.gridController.datePipe.transform(date, this._dateFormat)) || this.value
  }

  private get _dateFormat(): string {
    const format = this.gridController.localize.getLocalizedString('dateFormat')
    return format === 'dateFormat' ? 'yyyy/MM/dd' : format
  }

}

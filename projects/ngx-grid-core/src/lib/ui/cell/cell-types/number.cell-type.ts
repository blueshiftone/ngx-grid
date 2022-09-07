import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType, ERowStatus } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { NumberFormatParser } from '../../../utils/number-format-parser/number-format-parser'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class NumberCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly editableCssClassName = 'number-editable'
  private readonly readonlyCssClassName = 'number-readonly'

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
    this._displayNode.innerHTML = this._displayValue
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    const [node] = this.createBasicInput('number', this.editableCssClassName)
    return this._editableNode = node
  }

  private get _displayValue(): string {
    if (this.value === null) return ''
    const source       = this.gridController.dataSource
    const row          = this.gridController.dataSource.getRow(this.parentCell.rowKey)
    const isNewRow     = row?.status === ERowStatus.New
    const isPrimarykey = source.primaryColumnKey === this.parentCell.column.columnKey
    const hideValue    = this.gridController.cell.GetCellMeta.run(this.parentCell.coordinates).metadata.get<boolean>(EMetadataType.HideValue)
    if (hideValue || (source.maskNewIds && isNewRow && isPrimarykey)) return ''    
    let val: number = typeof this.value === 'number' ? this.value : parseFloat(this.value)
    const formatString = this.gridController.cell.GetCellMetaValue.run<string>(this.coordinates, EMetadataType.NumberFormatString)
    if (formatString !== null) {
      return NumberFormatParser.getParser(formatString).getHtml(val)
    } else {
      return val.toString()
    }
  }

  public override setValue(value: any): boolean {
    if (value === '') value = null
    return super.setValue(value)
  }

}

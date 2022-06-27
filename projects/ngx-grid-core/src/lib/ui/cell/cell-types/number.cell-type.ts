import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType, ERowStatus } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class NumberCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly editableCssClassName = 'number-editable'
  private readonly readonlyCssClassName = 'number-readonly'
  private decimalPlaces = 2

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
    this.decimalPlaces = this.gridController.cell.GetCellMetaValue.run<number>(this.coordinates, EMetadataType.DecimalPlaces) ?? this.decimalPlaces
    super.receiveValue(value)
    if (!this._displayNode) return;
    this._displayNode.innerText = this._displayValue
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
    const meta         = this.gridController.row.GetRowMeta.run(this.parentCell.rowKey)
    const isNewRow     = meta?.status === ERowStatus.New
    const isPrimarykey = source.primaryColumnKey === this.parentCell.columnKey
    if (source.maskNewIds && isNewRow && isPrimarykey) return ''    
    let val = typeof this.value === 'number' ? this.value : parseFloat(this.value)
    const bits = val.toFixed(this.decimalPlaces).toString().split('.').map(v => v === 'NaN' ? '0' : v)
    return `${parseInt(bits[0] || '0').toLocaleString(this.gridController.localize.culture)}${this.decimalPlaces > 0 ? '.' : ''}${(bits[1] || '').padEnd(this.decimalPlaces, '0')}`
  }

  public override setValue(value: any): boolean {
    if (value === '') value = null
    return super.setValue(value)
  }

}

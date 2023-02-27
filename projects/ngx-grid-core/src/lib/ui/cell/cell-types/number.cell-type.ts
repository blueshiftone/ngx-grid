import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { EMetadataType, ERowStatus } from '../../../typings/enums'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent, INumberOptions } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { BaseCellType, TTransformValue } from './abstractions/base-cell-type.abstract'
import { CELL_VALUE_PARSERS } from './value-parsing'

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

    let transformInput: TTransformValue | undefined = undefined

    if (this._scaleFactor) {
      const scale = this._scaleFactor
      const transform = (value: any, action: (value: number) => number) => {
        const validationResult = CELL_VALUE_PARSERS[this.type.name].validate(value, this.gridController, this.coordinates)
        if (validationResult.isValid) {
          const num = validationResult.transformedValue as number
          return action(num)
        }
        return value
      }
      transformInput = {
        get: (value: string) => transform(value, (num: number) => num * scale),
        set: (value: string) => transform(value, (num: number) => num / scale)
      }
    }

    const [node] = this.createBasicInput({
      cssClass      : this.editableCssClassName,
      type          : 'number',
      transformInput
    })
    return this._editableNode = node
  }

  private get _displayValue(): string {
    if (this.value === null) return ''
    const source       = this.gridController.dataSource
    const row          = this.gridController.dataSource.getRow(this.parentCell.rowKey)
    const isNewRow     = row?.status === ERowStatus.New
    const isPrimarykey = source.primaryColumnKey === this.parentCell.column.columnKey
    if (source.maskNewIds && isNewRow && isPrimarykey) return ''    
    let val: number = typeof this.value === 'number' ? this.value : parseFloat(this.value)
    if (this._numberOptions !== null) {
      return this.gridController.cell.GetFormattedValue.getHTML(this.coordinates, val)
    } else {
      return val.toString()
    }
  }

  public override setValue(value: any): boolean {
    if (value === '') value = null
    return super.setValue(value)
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const additionalWidth = 4
    const formattedVal = this.gridController.cell.GetFormattedValue.getPlainText(this.coordinates, this.value)
    return CharacterSizer.measure(formattedVal, this.getFont(), this.maxWidth) + additionalWidth
  }

  private get _numberOptions(): INumberOptions | null {
    return this.gridController.cell.GetCellMetaValue.run<INumberOptions>(this.coordinates, EMetadataType.NumberOptions)
  }

  private get _scaleFactor(): number | null {
    return this._numberOptions?.scaleFactor || null
  }

}

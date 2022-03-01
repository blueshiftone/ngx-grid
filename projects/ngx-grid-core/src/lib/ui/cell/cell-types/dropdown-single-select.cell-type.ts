import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode, EPositionPreference } from '../../../typings/enums'
import { IGridCellComponent, IGridCellType, IGridOverlayConfigs, IGridSelectListOption, TGridUITheme } from '../../../typings/interfaces'
import { ColorBrightness } from '../../../utils/color-brightness'
import { EGridOverlayTypes } from '../../grid-overlays/grid-overlay-types'
import { BaseCellType } from './abstractions/base-cell-type.abstract'

export class DropdownSingleSelectCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  private readonly readonlyCssClassName = 'single-select-readonly'

  private _displayNode?: HTMLElement
  private _editableNode?: HTMLElement
  private _labelNode?: HTMLDivElement
  private _chipNode?: HTMLDivElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }

  public get displayNode() { return this._displayNode || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._chipNode || !this._labelNode || !this._displayNode) return
    const val = this._displayValue
    this._setColor(this._chipNode)
    this._displayNode.classList.toggle('empty', val === null || typeof val === 'undefined' || val === '')
    this._displayNode.classList.toggle('related', this._isRelatedGrid)
    this._displayNode.classList.toggle('static', this._isStaticGrid)
    this._labelNode.innerText = (val ?? '').toString()
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this._chipNode    = this.createDiv('chip')
    this._labelNode   = this.createDiv('label')
    this._setColor(this._chipNode)
    this.receiveValue()
    this._chipNode.append(this._labelNode)
    this._displayNode.append(this._chipNode)
    return this._displayNode
  }

  private _setColor(chip: HTMLDivElement): void {
    const color = this._getStaticListItem(this.value)?.color ?? this.type.list?.color
    if (typeof color !== 'undefined') {
      chip.style.backgroundColor = color
      const brightness = ColorBrightness(color, this._themeMode)
      if (brightness !== null) {
        chip.classList.toggle('light', brightness.mode === 'light')
        chip.classList.toggle('dark', brightness.mode === 'dark')
        chip.classList.toggle('default', brightness.mode === 'default')
      }
    }
  }

  public override open(): IGridCellType {
    if (!this.isEditable || this.isOpen) return this
    const overlayConfigs: IGridOverlayConfigs = {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.VerticalBottom,
    }
    let overlayComponentType: EGridOverlayTypes = EGridOverlayTypes.StaticDropdownOverlay
    if (this._isRelatedGrid) {
      overlayConfigs.size = {
        width: 550,
        height: 300
      }
      overlayComponentType = EGridOverlayTypes.SingleSelectSimpleForeignKeyDropdownOverlay
    }
    this.openOverlay(overlayComponentType, overlayConfigs).afterClosed.then(() => {
      this.gridController.gridEvents.EditingCellChangedEvent.emit(null)
      this.close()
    })
    return this
  }

  private get _displayValue(): string | number {
    if (typeof this.type.list?.relatedGridID !== 'undefined') {
      return this.gridController.grid.GetRelatedDataPreviewString.run(this.type.list.relatedGridID!, this.value)
    }
    else return this.value
  }

  private get _isRelatedGrid(): boolean {
    return typeof this.type.list?.relatedGridID !== 'undefined'
  }

  private get _isStaticGrid(): boolean {
    return typeof this.type.list?.staticOptions !== 'undefined'
  }

  private _generateEditableNode(): HTMLElement {
    return this.displayNode
  }

  private get _themeMode(): TGridUITheme {
    return this.gridController.grid.GetThemeMode.run()
  }

  private _getStaticListItem(value?: any): IGridSelectListOption | undefined {
    return this.type?.list?.staticOptions?.find(op => op.value === value)
  }

}

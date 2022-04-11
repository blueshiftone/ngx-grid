import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridCellComponent, IGridSelectListOption, TGridUITheme } from '../../../typings/interfaces'
import { ColorBrightness } from '../../../utils/color-brightness'
import { BaseExpandableCellType } from './abstractions/base-expandable-cell-type.abstract'

export class DropdownMultiSelectCellType extends BaseExpandableCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  public get expandableComponentType() {
    return this._isRelatedGrid ? EGridOverlayType.MultiSelectGridCellPreview: EGridOverlayType.MultiSelectStaticCellPreview
  }
private readonly readonlyCssClassName = 'multi-select-readonly'

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
    if (!this._displayNode) return
    const htmlString = this._generateChips()
    this._displayNode.classList.toggle('empty', !htmlString.length)
    this._displayNode.innerHTML = htmlString
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.readonlyCssClassName)
    this._displayNode.classList.toggle('related', this._isRelatedGrid)
    this._displayNode.classList.toggle('static', this._isStaticGrid)
    this.receiveValue()
    return this._displayNode
  }

  private _generateChips(): string {
    let output: string[] = []
    for (const value of (this.value || [])) {
      if (this._isRelatedGrid) {
        let previewValue = this.gridController.grid.GetRelatedDataPreviewString.run(this.type.list!.relatedGridID!, value)
        if (value !== null && previewValue == value) {
          previewValue = this.createLoadingAnimation().outerHTML
        }
        output.push(this._createChip(previewValue, this.type.list?.color))
      } else {
        output.push(this._createChip(value, this._getStaticListItem(value)?.color))
      }
    }
    return output.join('\n')
  }

  private _createChip(txt: string | number, color?: string): string {
    let chipStyles: string[]  = []
    let chipClasses: string[] = []
    
    if (typeof color !== 'undefined') {
      chipStyles.push(`background-color:${color}`)
      const brightness = ColorBrightness(color, this._themeMode)
      if (brightness) chipClasses.push(brightness.mode)
    }

    let output = `
    <div class="chip${chipClasses.length ? ` ${chipClasses.join(' ')}` : ``}" ${chipStyles.length ? `style="${chipStyles.join(';')}" ` : ``}>
      <div class="label">${txt}</div>
    </div>
    `
    return output
  }

  private _getStaticListItem(value?: any): IGridSelectListOption | undefined {
    return this.type?.list?.staticOptions?.find(op => op.value === value)
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

}

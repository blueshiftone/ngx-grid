import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent } from '../../../typings/interfaces'
import { CharacterSizer } from '../../../utils/character-sizer'
import { BaseCellType } from './abstractions/base-cell-type.abstract'
import { ColorParser } from './value-parsing/parsers/color.parser'

export class ColorCellType extends BaseCellType {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)
  
  private readonly readonlyCssClassName = 'color-readonly'
  private readonly colorNodeClassName   = 'bubble'

  private _displayNode = this.createDiv(this.readonlyCssClassName)
  private _colorNode   = this.createDiv(this.colorNodeClassName)
  private _editableNode? : HTMLElement
  private _editableInput?: HTMLInputElement

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) {
    super(overlayService, parentCell, gridController)
    this._displayNode.append(this._colorNode)
  }

  public get displayNode()  { return this._displayNode }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public override receiveValue(value: any = this.value): void {

    if (value !== null) {
      const parsed = new ColorParser(value).run()
      if (!parsed.isValid) value = null
      else value = parsed.transformedValue
    }

    super.receiveValue(value)

    if (!this._displayNode) return;
    
    this._colorNode.style.backgroundColor = value
  }

  public override open() {
    if (!this.isEditable) return this

    this._generateEditableNode()

    if (this._editableInput) this._editableInput.value = this.value
    
    window.requestAnimationFrame(_ => this._editableInput?.click())

    return this;
  }

  private _generateEditableNode(): HTMLElement {
    if (!this._editableNode || !this._editableInput) {
      
      const [node, input] = this.createBasicInput({ type: 'color' })

      this._editableInput = input

      const { style } = node
      style.position  = 'absolute'
      style.top       = '0px'
      style.left      = '0px'
      style.opacity   = '0'

      this._displayNode.append(node)

      this._editableNode = this._displayNode
    }
    return this.displayNode
  }

  public override measureWidth(): number {
    if (!this.value) return 0
    const formattedVal = this.gridController.cell.GetFormattedValue.getPlainText(this.coordinates, this.value)
    return CharacterSizer.measure(formattedVal, this.getFont(), this.maxWidth)
  }

}

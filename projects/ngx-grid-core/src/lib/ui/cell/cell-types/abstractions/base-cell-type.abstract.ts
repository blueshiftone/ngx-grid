import { BehaviorSubject, fromEvent, Subject, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'

import { GridControllerService } from '../../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../../typings/enums/cell-mode.enum'
import { IGridCellComponent, IGridCellType, IGridOverlayConfigs, IGridOverlayOpened } from '../../../../typings/interfaces'
import { IGridDataType } from '../../../../typings/interfaces/grid-data-type.interface'
import { HasParentOfClass } from '../../../../utils/find-parent-element-of-class'
import { TO_ARRAY } from '../../../../utils/to-array'
import { EGridOverlayTypes } from '../../../grid-overlays/grid-overlay-types'

export abstract class BaseCellType implements IGridCellType {
  public abstract mode        : BehaviorSubject<ECellMode>
  public focus                : BehaviorSubject<boolean>
  public abstract displayNode : HTMLElement
  public abstract editableNode: HTMLElement
  public readonly type        : IGridDataType
  public value                : any = null
  public valueChanged = new Subject<void>()

  public readonly subscriptions = new Set<Subscription>()

  constructor(
    private readonly overlayService: GridOverlayService,
    public  readonly parentCell    : IGridCellComponent,
    public  readonly gridController: GridControllerService
  ) {
    this.type  = this.parentCell.type
    this.focus = this.parentCell.focus
  }

  public attachTo(e: HTMLElement): IGridCellType {
    e.prepend(this.activeNode)
    return this
  }

  public close(): IGridCellType {
    if (this.isOpen) this._swapMode()
    return this
  }

  public open(): IGridCellType {
    if (
      this.isClosed && 
      (this.isEditable || HasParentOfClass('cdk-overlay-container', this.parentCell.element))
    ) this._swapMode()
    return this
  }

  public setValue(value: any): boolean {
    let validationResult = this.gridController.cell.SetCellValue.run(this.coordinates, value)
    if (validationResult.isValid) {
      this.receiveValue(value)
      this.gridController.cell.SetCellDraftValue.buffer(this.coordinates)
    }
    return validationResult.isValid
  }

  public initializeValue(value: any): IGridCellType {
    this.receiveValue(value)
    return this
  }

  public receiveValue(value: any): void {
    this.value = value
    this.valueChanged.next()
  }

  public openOverlay(componentType: EGridOverlayTypes, configs?: IGridOverlayConfigs): IGridOverlayOpened {
    return this.overlayService.open(this, componentType, configs)
  }

  public onDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
    this.activeNode.remove()
  }

  private _swapMode(): void {
    const currentActive = this.activeNode
    this.mode.next(this.mode.value === ECellMode.Editable ? ECellMode.Readonly : ECellMode.Editable)
    if (currentActive === this.activeNode) return

    const parentEl = currentActive.parentElement
    if (parentEl === null) throw new Error("Parent element is null")
    parentEl.insertBefore(this.activeNode, currentActive)
    currentActive.remove()
  }

  public get activeNode(): HTMLElement {
    return this.mode.value === ECellMode.Editable ? this.editableNode : this.displayNode
  }

  public get isOpen(): boolean { return this.mode.value === ECellMode.Editable }
  public get isClosed(): boolean { return this.mode.value === ECellMode.Readonly }

  public get coordinates() { return this.parentCell.coordinates }

  public get isEditable(): boolean {
    return this.gridController.cell.GetCellIsEditable.run(this.coordinates)
  }

  /* Helper Node Creators */

  public createBasicInput(type = 'text', cssClass?: string): [HTMLDivElement, HTMLInputElement] {
    const div   = this.createDiv(cssClass)
    const input = this.createInput(type)
    input.value = this.value

    div.appendChild(input)
    input.oninput = e => {
      if (!this.setValue(input.value)) {    
        e.preventDefault()
        input.value = this.value
      }
    }

    this.subscriptions.add(this.valueChanged.subscribe(_ => input.value = this.value))

    this.subscriptions.add(this.mode.pipe(filter(mode => mode === ECellMode.Editable)).subscribe(_ => window.requestAnimationFrame(_ => input.select())))

    // Key bindings
    this.subscriptions.add(fromEvent<KeyboardEvent>(div, 'keydown').subscribe(e => {
      switch(e.key.toLowerCase()) {
        case 'enter':
        case 'escape':
          e.stopImmediatePropagation()     
          this.gridController.gridEvents.EditingCellChangedEvent.emit(null)
        break;
        case 'tab':
          e.stopImmediatePropagation()
          e.preventDefault()
          this.gridController.gridEvents.EditingCellChangedEvent.emit(null)      
          this.gridController.gridEvents.GridKeyCmdPressedEvent.emit({
            key: 'Tab',
            hasCtrlKey: e.ctrlKey || e.metaKey,
            hasShiftKey: e.shiftKey
          })
        break;
      }
    }))

    return [div, input]
  }

  public createDiv(classes?: string | string[]): HTMLDivElement {
    const node = document.createElement('div')
    if (typeof classes !== 'undefined') TO_ARRAY(classes).forEach(c => node.classList.add(c))
    return node
  }

  public createInput(type = 'text'): HTMLInputElement {
    const node = document.createElement('input')
    node.type = type
    return node
  }

  public createLoadingAnimation(): HTMLDivElement {
    const node = this.createDiv()
    node.innerHTML = `<div class="loading-dots"><div></div><div></div><div></div></div>`
    return node.firstElementChild as HTMLDivElement
  }

  protected getValue():any {
    return this.value
  }

}

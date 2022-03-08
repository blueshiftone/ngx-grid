import { BehaviorSubject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { ECellMode } from '../../../typings/enums/cell-mode.enum'
import { IGridCellComponent, IGridFileUpload } from '../../../typings/interfaces'
import { IGridFileCellValue } from '../../../typings/interfaces/grid-file-cell-value.interface'
import { EGridOverlayTypes } from '../../grid-overlays/grid-overlay-types'
import { BaseExpandableCellType } from './abstractions/base-expandable-cell-type.abstract'

export class FileCellType extends BaseExpandableCellType  {

  public mode = new BehaviorSubject<ECellMode>(ECellMode.Readonly)

  public expandableComponentType = EGridOverlayTypes.FileGridCellPreviewOverlay

  public dropZoneState      = new BehaviorSubject<boolean>(false)
  public dropZoneHoverState = new BehaviorSubject<boolean>(false)
  
  private readonly cssClassName = 'file-cell-type'

  private readonly _clipSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 9.18"><g style="opacity:0.87"><path d="M.63,8.64a2.28,2.28,0,0,1-.57-1A1.81,1.81,0,0,1,.54,5.87C1.65,4.78,3.69,2.73,5,1.37L5.6.81A2.48,2.48,0,0,1,9.19.73a2.72,2.72,0,0,1-.11,4c-.89.94-2.6,2.65-3.73,3.79l-.58.57-.51-.51L4.83,8C6,6.86,7.67,5.15,8.56,4.21a2,2,0,0,0,.12-3,1.76,1.76,0,0,0-2.57.07l-.55.56C4.2,3.24,2.16,5.3,1.05,6.38A1.08,1.08,0,0,0,.77,7.47a1.32,1.32,0,0,0,.86,1,.93.93,0,0,0,.94-.31l.93-.92C4.67,6,6.27,4.47,7.14,3.49A.47.47,0,0,0,7.19,3a.4.4,0,0,0-.48-.14c-.87.79-3,2.95-3,3l-.52-.51c.09-.09,2.17-2.2,3.06-3A1,1,0,0,1,7,2.11a1.18,1.18,0,0,1,.81.44A1.19,1.19,0,0,1,7.68,4C6.79,5,5.18,6.55,4,7.7l-.93.92a1.65,1.65,0,0,1-1.64.5A1.82,1.82,0,0,1,.63,8.64Z"/></g></svg>`

  private _displayNode? : HTMLElement
  private _editableNode?: HTMLElement
  private _dropZoneNode?: HTMLElement

  private _lastSeenPendingUploads: IGridFileUpload[] = []

  constructor(
    gridController: GridControllerService,
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent
  ) { super(overlayService, parentCell, gridController) }
  
  public get displayNode()  { return this._displayNode  || this._generateDisplayNode() }
  public get editableNode() { return this._editableNode || this._generateEditableNode() }

  public valueHasChanged = () => {
    const pendingUploads = this.gridController.uploads.getPendingUploadsForCell(this.coordinates)
    const output = pendingUploads.length !== this._lastSeenPendingUploads.length
    || new Set([...pendingUploads.map(x => x.id), ...this._lastSeenPendingUploads.map(x => x.id)]).size !== pendingUploads.length
    this._lastSeenPendingUploads = pendingUploads
    return output
  }

  public override receiveValue(value: any = this.value): void {
    super.receiveValue(value)
    if (!this._displayNode) return
    const pendingUploads = this.gridController.uploads.getPendingUploadsForCell(this.coordinates)
    this._lastSeenPendingUploads = pendingUploads

    const docFragment = new DocumentFragment()
    const helperDiv = this.createDiv();

    if (pendingUploads.length) {
      const conicGradient = (progress: number) => `conic-gradient(var(--text-color) ${progress}%, transparent 0)`

      for (const pending of pendingUploads) {
        const chip = 
       `<div class="chip upload pending" id="_${pending.id}">
          ${this._clipSvg}
          <div class="label">${pending.file.name}</div>
          <div class="progressBar" style="background: ${conicGradient(pending.progress.value)};"></div>
          <div class="progressTxt">${pending.progress.value}%</div>
        </div>`
        helperDiv.innerHTML = chip;
        if(helperDiv.firstElementChild) docFragment.append(helperDiv.firstElementChild)
        const progressBar = docFragment.querySelector(`#_${pending.id} > .progressBar`) as HTMLElement | null
        const progressTxt = docFragment.querySelector(`#_${pending.id} > .progressTxt`) as HTMLElement | null
        pending.progress.pipe(takeUntil(this.valueChanged)).subscribe(percent => {
          if (progressBar) progressBar.style.background = conicGradient(percent)
          if (progressTxt) progressTxt.innerText = `${percent.toString()}%` 
        })
      }  
    }

    if (typeof this.value === 'object' && this.value !== null) {
      const val = this.value as IGridFileCellValue
      const chip = 
       `<div class="chip upload">
          ${this._clipSvg}
          <div class="label">${val.fileName}</div>
        </div>`
        helperDiv.innerHTML = chip;
        if(helperDiv.firstElementChild) docFragment.append(helperDiv.firstElementChild)
    }

    this._displayNode.replaceChildren(docFragment)
  }

  public dragStart() {
    this._dropZoneNode = this.createDiv('file-dropzone')
    this.displayNode.appendChild(this._dropZoneNode)
    this.displayNode.classList.add('dropzone-active')
    this.dropZoneState.next(true)
  }

  public dragStop() {
    this._dropZoneNode?.remove()
    this.displayNode.classList.remove('dropzone-active')
    this.dropZoneState.next(false)
  }

  public hoverStart() {
    this.displayNode.classList.add('hover')
    this.dropZoneHoverState.next(true)
  }

  public hoverStop() {
    this.displayNode.classList.remove('hover')
    this.dropZoneHoverState.next(false)
  }

  private _generateDisplayNode(): HTMLElement {
    this._displayNode = this.createDiv(this.cssClassName)
    this.receiveValue()
    return this._displayNode
  }

  private _generateEditableNode(): HTMLElement {
    return this.displayNode
  }

}

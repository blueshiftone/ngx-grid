import { OverlayRef, OverlaySizeConfig } from '@angular/cdk/overlay'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators'

import { GridControllerService } from '../../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../../typings/enums'
import { EGridOverlayType } from '../../../../typings/enums/grid-overlay-type.enum'
import {
    IGridCellComponent,
    IGridCellType,
    IGridExpandableCellData,
    IGridOverlayConfigs,
    IGridOverlayOpened,
    IGridSelectionRange,
} from '../../../../typings/interfaces'
import { FindParentOfClass, HasParentMatching, HasParentOfClass } from '../../../../utils/find-parent-element-of-class'
import { BaseCellType } from './base-cell-type.abstract'

export abstract class BaseExpandableCellType extends BaseCellType {

  public abstract expandableComponentType: EGridOverlayType

  private _expandablePreviewClosed = new Subject<void>()
  private _expandablePreviewIsOpen = false
  private _expandableData?: IGridExpandableCellData
  private _expandableOpened?: IGridOverlayOpened

  constructor(
    overlayService: GridOverlayService,
    parentCell    : IGridCellComponent,
    gridController: GridControllerService
  ) {
    super(overlayService, parentCell, gridController)

    this.subscriptions.add(this.focus.pipe(distinctUntilChanged(), debounceTime(0)).subscribe(hasFocus => {
      if (hasFocus && this._isVisible) this._openExpandablePreview(true)
    }))

    this.subscriptions.add(this.focus.pipe(filter(hasFocus => hasFocus)).subscribe(_ => {
      this.subscriptions.add(this.gridController.gridEvents.GridScrollStoppedEvent.on()
        .pipe(takeUntil(this.focus.pipe(filter(hasFocus => !hasFocus))))
        .subscribe(_ => {
          if (!this.focus.value || !this._isVisible || (this._selection?.cellCount ?? 0) > 1) return
          window.requestAnimationFrame(_ => {
            this._openExpandablePreview(true)
            this._expandableOpened?.overlayRef.updatePosition()
          })
        })
      )
    }))

  }

  public override open(): IGridCellType {
    this._openExpandablePreview()
    return this
  }

  public override close(): IGridCellType {
    if (this.isOpen) this._expandableOpened?.overlayRef.detach()
    return this
  }

  private async _openExpandablePreview(initialOpen?: boolean) {
    this._expandableData = this._expandableData ?? { expandTrigger: new Subject() }
    if (this._expandablePreviewIsOpen) {
      if (!initialOpen) this._expandableData.expandTrigger.next()
      return
    }

    if ((!this._isVisible || (this._selection?.cellCount ?? 0) > 1)&& !HasParentOfClass('cdk-overlay-container', this.parentCell.element)) {
      this.close()
      return
    }

    const parentCellElement = FindParentOfClass('cell', this.displayNode)    
    this._expandablePreviewIsOpen = true
    this._expandableData.backgroundColor = parentCellElement ? window.getComputedStyle(parentCellElement).backgroundColor : ''

    const overlayConfigs: IGridOverlayConfigs = {
      flexibleDimensions: false,
      positionPreference: EPositionPreference.Centered,
      size: this._getExpandableCellSize(),
      data: this._expandableData
    }

    this._expandableOpened = this.openOverlay(this.expandableComponentType, overlayConfigs)
    this._startObserver(this._expandableOpened.overlayRef)

    await this._expandableOpened.afterClosed

    this._expandablePreviewIsOpen = false
    this._expandablePreviewClosed.next()
    this.gridController.gridEvents.EditingCellChangedEvent.emit(null)
    
    this.close()
  }

  private _startObserver(overlayRef: OverlayRef) {

    const observer = new MutationObserver(mutation => {
        if (mutation[0].target.nodeType === 1 && HasParentMatching(overlayRef.overlayElement, mutation[0].target as HTMLElement)) return
        overlayRef.updateSize(this._getExpandableCellSize())
        overlayRef.updatePosition()
    });

    const container = document.documentElement ?? document.body;

    observer.observe(container, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })

    this.subscriptions.add(this._expandablePreviewClosed.pipe(take(1)).subscribe(_ => observer.disconnect()))

  }

  private _getExpandableCellSize(): OverlaySizeConfig {
    return { height: this.displayNode.clientHeight * 2, width: this.displayNode.clientWidth + (this.displayNode.clientHeight / 2) }
  }

  private get _isVisible(): boolean {
    return this.gridController.grid.GetCellVisibility.run(this.coordinates)?.isFullyVisible === true
  }

  private get _selection(): IGridSelectionRange | undefined | null {
    return this.gridController.gridEvents.CellSelectionChangedEvent.state
  }

}

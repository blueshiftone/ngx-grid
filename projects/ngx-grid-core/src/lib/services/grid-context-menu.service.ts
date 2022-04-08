import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Injectable, InjectionToken, Injector } from '@angular/core'
import { fromEvent, SubscriptionLike } from 'rxjs'
import { first } from 'rxjs/operators'

import { GridControllerService } from '../controller/grid-controller.service'
import { GridEventsService } from '../events/grid-events.service'
import { IGridContextMenu, IGridContextMenuItem } from '../typings/interfaces'
import { ContextMenuOverlayComponent } from '../ui/grid-overlays/context-menu-overlay/context-menu-overlay.component'
import { HasParentOfClass } from '../utils/find-parent-element-of-class'
import { GridMultiCellEditService } from './grid-multi-cell-edit.service'
import { EGridIcon } from './icon.service'

@Injectable({
  providedIn: 'root'
})
export class GridContextMenuService {

  private _overlayRef?: OverlayRef
  private _subscriptions = new Set<SubscriptionLike>()

  private readonly overlayCSSClassName = 'grid-context-menu'

  constructor(
    private readonly overlay      : Overlay,
    private readonly events       : GridEventsService,
    private readonly multiCellEdit: GridMultiCellEditService,
    private readonly gridController: GridControllerService,
  ) {}

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  public open(e: MouseEvent, items: IGridContextMenuItem[]): void {
    if (!items.length) return
    const menu: IGridContextMenu = {
      items,
      loc: this.gridController.localize
    }
    this.onDestroy()
    const ref      = this._createOverlayRef(e.clientX, e.clientY)
    const injector = Injector.create({ providers: [{ provide: GRID_CONTEXT_MENU, useValue: menu }] })
    ref.attach(new ComponentPortal(ContextMenuOverlayComponent, null, injector))
    this._startSubscribers()
  }

  public getSelectionContextMenuItems(): IGridContextMenuItem[] {
    
    const output: IGridContextMenuItem[] = []
    
    const selection = this.gridController.selection.latestSelection()
    
    if (selection) {

      const distinctType = this.multiCellEdit.getDistinctType(selection)
      
      if (distinctType) {

        const editors = distinctType.editors.map(e => new e(null, distinctType.type.name))

        let action: ((e: MouseEvent) => any) | undefined = (e: MouseEvent) => this.multiCellEdit.openValueEditor({
          strategy: 'coords',
          coords: {
            x: e.clientX,
            y: e.clientY
          }
        }, selection)

        if (distinctType.type.name === 'Boolean') action = undefined
        
        output.push({
          label : 'locSetValues',
          action,
          icon: EGridIcon.MultiEdit,
          children: editors.map(editor => {
            return {
              action: (e: MouseEvent) => {
                this.multiCellEdit.runMultiEditor(editor.label, selection, {
                  strategy: 'coords',
                  coords: { x: e.clientX, y: e.clientY }
                })
              },
              label: editor.label
            }
          })
        })
      }

      const source = this.gridController.dataSource
      const { canInsert, canDelete } = source

      if (canInsert) {
        output.push(...[
          {
            label: 'locInsertARecordAbove',
            action: () => this.gridController.row.InsertRowAboveSelection.run(),
            icon: EGridIcon.InsertAboveSelection
          },
          {
            label: 'locInsertARecordBelow',
            action: () => this.gridController.row.InsertRowBelowSelection.run(),
            icon: EGridIcon.InsertBelowSelection
          },
        ])
      }

      output.push({
        label : 'locCopySelection',
        action: () => this.gridController.selection.CopySelection.run(),
        icon  : EGridIcon.Copy
      })

      if (canDelete) {
        output.push({
          label: `locDeleteRecord(s)`,
          action: () => selection.rowKeys.forEach(k => this.gridController.row.DeleteRow.buffer(k)),
          icon: EGridIcon.Delete
        })
      }
      
    }
    return output

  }

  private _startSubscribers(): void {

    this._subscriptions.add(fromEvent(document.documentElement, 'mousedown').subscribe(e => {
      if (
        e.target && (e.target as Node).nodeType === 1 &&
        !HasParentOfClass('cdk-overlay-pane', e.target as HTMLElement)
      ) this._overlayRef?.detach()
    }))

    this._subscriptions.add(
      fromEvent<MouseEvent>(document.documentElement, 'mouseup')
      .subscribe(e => {
        if (
          HasParentOfClass('cdk-overlay-pane', e.target as HTMLElement)
          && !HasParentOfClass('stop-propagation', e.target as HTMLElement)
          && e.button === 0
        ) {
          window.requestAnimationFrame(_ => this._overlayRef?.detach())
        }
    }))

    this._subscriptions.add(
      this.events.factory.GridScrollOffsetChangedEvent.on()
      .subscribe(_ => this._overlayRef?.detach())
    )

  }

  private _createOverlayRef(x: number, y: number) {

    if (this._overlayRef) this._overlayRef.detach()

    const ops: OverlayConfig = {
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),
      panelClass      : [this.overlayCSSClassName],
      hasBackdrop     : false,
      width           : 'auto',
      height          : 'auto',
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withPositions([
          { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
          { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
        ])
        .withFlexibleDimensions()
    }

    this._overlayRef = this.overlay.create(ops)
    
    this._overlayRef.detachments().pipe(first()).subscribe(_ => {
      this._overlayRef?.dispose()
      this._overlayRef = undefined
    })
    return this._overlayRef
  }

}

export const GRID_CONTEXT_MENU = new InjectionToken<IGridContextMenu>('GRID_CONTEXT_MENU')



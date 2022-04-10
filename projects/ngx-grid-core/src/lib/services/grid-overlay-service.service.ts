import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal, ComponentType } from '@angular/cdk/portal'
import { ComponentRef, Injectable, InjectionToken, Injector } from '@angular/core'
import { merge, Subscription } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'

import { GridControllerService } from '../controller/grid-controller.service'
import { GridEventsService } from '../events/grid-events.service'
import { EPositionPreference } from '../typings/enums/position-preference.enum'
import { IGridCellType, IGridOverlayConfigs, IGridOverlayData, IGridOverlayOpened } from '../typings/interfaces'
import GRID_OVERLAYS, { EGridOverlayTypes as EGridOverlayType } from '../ui/grid-overlays/grid-overlay-types'
import { OverlayPositionBuilder } from './overlay-position-builder.class'

@Injectable({
  providedIn: 'root'
})
export class GridOverlayService {

  private _overlayRefs = new Set<OverlayRef>()
  private _resolveMap = new WeakMap<OverlayRef, any>()
  private _components = new WeakMap<OverlayRef, ComponentRef<any>>()

  private _subs: Set<Subscription> = new Set()

  constructor(
    private readonly overlay       : Overlay,
    private readonly events        : GridEventsService,
    public  readonly gridController: GridControllerService,
  ) {
    this._subs.add(merge(
      this.events.factory.GridScrollStartedEvent.on(), 
      this.events.factory.CellSelectionChangedEvent.on(),
    ).subscribe(_ => this._overlayRefs.size && this.closeAll()))
  }

  public open(originCell: IGridCellType, componentType: EGridOverlayType, configs: IGridOverlayConfigs = {}): IGridOverlayOpened {
    const component = GRID_OVERLAYS.get(componentType)
    if (!component) throw new Error(`Overlay component for component type ${EGridOverlayType[componentType]} is not registered.`);
    for (const ref of this._overlayRefs) {
      if (this._components.get(ref)?.instance instanceof component) {
        ref.detach()
        break
      }
    }
    configs.positionPreference = configs.positionPreference ?? EPositionPreference.HorizontalRight
    const pos = EPositionPreference[configs.positionPreference]
    let ref: OverlayRef
    ref = this._createOverlayRef(pos, configs.referenceElement ?? originCell.activeNode, configs)
    const promise = new Promise<void>(resolve => this._resolveMap.set(ref, resolve))
    const componentPortal = new ComponentPortal(component, null, this._createInjector(originCell, ref, configs.data))
    const componentRef    = ref.attach(componentPortal)
    componentRef.changeDetectorRef.detectChanges()
    this._components.set(ref, componentRef)
    const output = {afterClosed: promise, overlayRef: ref, component: componentRef}
    this.gridController.gridEvents.GridOverlayOpenedEvent.emit(Object.assign({ originCell }, output))
    return output
  }

  public closeAll(): void {
    this._overlayRefs.forEach(ref => ref.detach())
  }

  public closeComponent(component: ComponentType<any>): void {
    this._overlayRefs.forEach(ref => {
      if (this._components.get(ref)?.instance instanceof component) ref.detach()
    })
  }

  public onDestroy(): void {
    this._subs.forEach(s => s.unsubscribe())
    this.closeAll()
  }

  private _createOverlayRef(position: string, sourceElement: HTMLElement, configs: IGridOverlayConfigs = {}) {

    const ops: OverlayConfig = {
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),
      panelClass      : ['grid-overlay', position],
      hasBackdrop     : configs.hasBackdrop === true,
      backdropClass   : configs.backdropClass ?? 'transparent-backdrop',
      positionStrategy: new OverlayPositionBuilder(this.overlay)
        .connectedToElement(sourceElement)
        .withPosition(configs.positionPreference ?? EPositionPreference.HorizontalRight)
        .withFlexibleDimensions(configs.flexibleDimensions)
        .positionStrategy,
      ...configs.size ?? { width: 'auto', height: 'auto' }
    }

    const ref = this.overlay.create(ops)
    this._overlayRefs.add(ref)
    if (configs.backdropCloseOnClick ?? true === true) {
      ref.backdropClick().pipe(takeUntil(ref.detachments())).subscribe(_ => ref.detach())
    }
    ref.detachments().pipe(first()).subscribe(_ => {
      this._resolveMap.get(ref)?.()
      this._overlayRefs.delete(ref)
      ref.dispose()
    })
    return ref
  }

  private _createInjector(cell: IGridCellType, ref: OverlayRef, customData?: any) {
    const data: IGridOverlayData = {
      currentCell   : cell,
      overlayRef    : ref,
      overlayService: this,
      gridController: this.gridController,
      gridOverlay   : this,
      customData: customData,
    }
    return Injector.create({ providers: [{ provide: GRID_OVERLAY_DATA, useValue: data }] })
  }

}

export const GRID_OVERLAY_DATA = new InjectionToken<IGridOverlayData>('GRID_OVERLAY_DATA')



import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../services/grid-overlay-service.service'
import { IGridOverlayData, TGridUITheme } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  template: ''
})
export class BaseOverlayComponent extends AutoUnsubscribe implements OnInit {

  public get editable() { return this.cell.isEditable }
  public value   : any

  constructor(
    @Inject(GRID_OVERLAY_DATA) public data: IGridOverlayData,
    public  cd: ChangeDetectorRef,
  ) { super() }

  ngOnInit(): void {

    if (!this.cell) throw new Error('Current cell is not defined in GridOverlayService')

    this.value = this.cell.value

    this.addSubscription(this.cell.valueChanged.subscribe(_ => {
      this.value = this.cell.value
      this.cd.detectChanges()
    }))

  }

  public localize(str: string): string {
    return this.gridController.localize.getLocalizedString(str)
  }

  public close(): void {
    this.data.overlayRef.detach()
  }

  public updateValue(value: any) {
    this.cell.setValue(value)    
  }

  public get cell() {
    return this.data.currentCell
  }

  public get overlayService() {
    return this.data.overlayService
  }

  public get gridController() {
    return this.data.gridController
  }

  public get themeMode(): TGridUITheme {
    return this.gridController.gridEvents.GridUIThemeChangedEvent.state ?? 'light'
  }

  protected get cellViewContainerRef() {
    return this.gridController.cell.CellComponents.findWithCoords(this.data.currentCell.coordinates)?.viewContainerRef ?? null
  }

}
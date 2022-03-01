import { OverlayRef } from '@angular/cdk/overlay'
import { ComponentRef } from '@angular/core'


export interface IGridOverlayOpened {
  afterClosed: Promise<void>
  overlayRef : OverlayRef
  component  : ComponentRef<any>
}

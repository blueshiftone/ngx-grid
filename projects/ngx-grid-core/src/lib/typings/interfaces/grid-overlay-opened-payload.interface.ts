import { OverlayRef } from '@angular/cdk/overlay'
import { ComponentRef } from '@angular/core'

import { IGridCellType } from './grid-cell-type.interface'

export interface IGridOverlayOpenedPayload {
  originCell : IGridCellType
  afterClosed: Promise<void>
  overlayRef : OverlayRef
  component  : ComponentRef<any>
}

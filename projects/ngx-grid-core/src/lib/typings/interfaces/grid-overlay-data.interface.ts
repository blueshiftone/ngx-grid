import { OverlayRef } from '@angular/cdk/overlay'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridOverlayService } from '../../services/grid-overlay-service.service'
import { IGridCellType } from './grid-cell-type.interface'


export interface IGridOverlayData<TData = any> {
  currentCell   : IGridCellType
  overlayRef    : OverlayRef
  overlayService: GridOverlayService
  gridController: GridControllerService
  gridOverlay   : GridOverlayService
  customData    : TData
}

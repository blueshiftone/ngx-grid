import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../typings/enums'
import { IGridExpandableCellData, IGridFileUpload, IGridOverlayData } from '../../../typings/interfaces'
import { IGridFileCellValue } from '../../../typings/interfaces/grid-file-cell-value.interface'
import { BasePreviewComponent } from '../base-grid-preview-overlay.component'
import { EGridOverlayTypes } from '../grid-overlay-types'

@Component({
  selector: 'data-grid-file-grid-cell-preview-overlay',
  templateUrl: './file-grid-cell-preview-overlay.component.html',
  styleUrls: ['./file-grid-cell-preview-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileGridCellPreviewComponentOverlay extends BasePreviewComponent implements OnInit {

  public chipColor = 'rgba(16, 161, 214, 0.4)'
  public files: IGridFileCellValue[] = []
  public pending: IGridFileUpload[] = []

  constructor(
    @Inject(GRID_OVERLAY_DATA) data: IGridOverlayData<IGridExpandableCellData>,
    cd                             : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>
  ) { super(data, cd) }

  private _isOpen = false

  public override ngOnInit() {
    super.ngOnInit()
    if (this.value) this.files.push(this.value)
    this._checkPendingUploads()
    this.addSubscription(this.cell.valueChanged.subscribe(_ => {
      this.files = this.cell.value ? [this.cell.value] : []
      this._checkPendingUploads()
      this.cd.detectChanges()
    }))
  }

  private _checkPendingUploads() {
    this.pending = this.gridController.uploads.getPendingUploadsForCell(this.cell.coordinates)
  }

  public async expand(): Promise<void> {

    if (this._isOpen) return

    this._isOpen = true

    const output = this.data.overlayService.open(this.data.currentCell, EGridOverlayTypes.FileGridCellSelectedList, {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.HorizontalRight,
      referenceElement: this.elRef.nativeElement,
    })

    await output.afterClosed

    this._isOpen = false

  }

  public removePending(u: IGridFileUpload): void {
    this.pending.splice(this.pending.indexOf(u), 1)
    this.gridController.uploads.cancelUpload(u)
    this.updateValue(this.files.length ? this.files[0] : null)
  }

  public remove(f: IGridFileCellValue): void {
    this.files.splice(this.files.indexOf(f), 1)
    this.updateValue(this.files.length ? this.files[0] : null)
  }

  public add(): void {
    this.gridController.uploads.pickFile((fileList) => {
      const { gridController, coordinates } = this.cell
      gridController.gridEvents.GridFileUploadCreatedEvent.emit(
        gridController.uploads.createUpload(fileList, coordinates, gridController.grid.GetGridId.run())
      );
      const component = gridController.cell.CellComponents.findWithCoords(coordinates)
      component?.typeComponent?.receiveValue(gridController.cell.GetCellValue.run(coordinates)?.value)
    })
  }

  public requestDownload(fileValue: IGridFileCellValue): void {
    this.gridController.gridEvents.FileDownloadRequestedEvent.emit({
      value          : fileValue,
      cellCoordinates: this.cell.coordinates,
      gridId         : this.gridController.grid.GetGridId.run()
    })
  }

}

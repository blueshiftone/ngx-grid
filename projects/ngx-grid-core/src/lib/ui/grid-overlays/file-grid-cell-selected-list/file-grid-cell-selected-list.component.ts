import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridOverlayData } from '../../../typings/interfaces'
import { IGridFileCellValue } from '../../../typings/interfaces/grid-file-cell-value.interface'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'lib-file-grid-cell-selected-list',
  templateUrl: './file-grid-cell-selected-list.component.html',
  styleUrls: ['./file-grid-cell-selected-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileGridCellSelectedListComponent extends BaseOverlayComponent implements OnInit {

  public files: IGridFileCellValue[] = []

  constructor(
    @Inject(GRID_OVERLAY_DATA) data: IGridOverlayData,
    cd: ChangeDetectorRef,
  ) { super(data, cd) }

  override ngOnInit(): void {
    super.ngOnInit()
    if (this.value) this.files.push(this.value)
    this.addSubscription(this.cell.valueChanged.subscribe(_ => {
      this.files = this.cell.value ? [this.cell.value] : []
      this.cd.detectChanges()
    }))

    this.addSubscription(this.gridController.localize.changes.subscribe(_ => this.cd.detectChanges()))
  }

  public newUpload(): void {
    this.gridController.uploads.pickFile((fileList) => {
      const { gridController, coordinates } = this.cell
      gridController.gridEvents.GridFileUploadCreatedEvent.emit(
        gridController.uploads.createUpload(fileList, coordinates, gridController.grid.GetGridId.run())
      );
      const component = gridController.cell.CellComponents.findWithCoords(coordinates)
      component?.typeComponent?.receiveValue(gridController.cell.GetCellValue.run(coordinates)?.value)
    })
  }

  public remove(fileValue: IGridFileCellValue): void {
    this.files.splice(this.files.indexOf(fileValue), 1)
    this.updateValue(this.files.length ? this.files[0] : null)
  }

  public download(fileValue: IGridFileCellValue): void {
    this.gridController.gridEvents.FileDownloadRequestedEvent.emit({
      value          : fileValue,
      cellCoordinates: this.cell.coordinates,
      gridId         : this.gridController.grid.GetGridId.run()
    })
  }

  public get locRemoveFile(): string { return this.gridController.localize.getLocalizedString('locRemoveFile') }
  public get locDownloadFile(): string { return this.gridController.localize.getLocalizedString('locDownloadFile') }

}

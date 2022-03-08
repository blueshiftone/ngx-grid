import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'

import { EFileUploadStatus } from '../typings/enums/file-upload-status.enum'
import { IGridCellCoordinates, IGridFilesSelected, IGridFileUpload } from '../typings/interfaces'

@Injectable({
  providedIn: 'root'
})
export class GridFileUploadService {

  private _uploads = new Map<string, IGridFileUpload>();

  constructor() { }

  public addUpload(upload: IGridFileUpload) {
    this._uploads.set(upload.id, upload)
  }

  public cancelUpload(upload: IGridFileUpload) {
    upload.uploadStream?.error("Upload stream cancelled")
    this.removeUpload(upload)
  }

  public removeUpload(upload: IGridFileUpload) {
    this._uploads.delete(upload.id)
  }

  public createUpload(fileLisit: FileList, coords: IGridCellCoordinates, gridId: string): IGridFilesSelected {

    const files: IGridFileUpload[] = [...fileLisit].map(file => ({
      id: uuidv4(),
      file,
      progress: new BehaviorSubject(0),
      status: new BehaviorSubject<EFileUploadStatus>(EFileUploadStatus.Waiting),
      cellCoords: coords,
      gridId,
    }))

    // files.forEach(f => this.addUpload(f));
    // TODO: multiple file uploads

    this.addUpload(files[0])

    return { ...coords, files }
  }

  public getPendingUploadsForCell(coords: IGridCellCoordinates): IGridFileUpload[] {
    const output: IGridFileUpload[] = []
    if (this._uploads.size > 0) {
      output.push(...[...this._uploads.values()].filter(x => x.cellCoords.equals(coords)))
    }
    return output
  }

  public pickFile(callback: (files: FileList) => void): void {
    const input = document.createElement('input')

    input.type           = 'file'
    input.multiple       = false
    input.style.position = 'absolute'
    input.style.opacity  = '0'

    document.body.appendChild(input)

    input.onclick = () => input.remove()

    input.onchange = () => {
      if (input.files?.length) {
        callback(input.files)
      }
    }

    input.click()
  }

}

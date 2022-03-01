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

  public createUpload(fileLisit: FileList, coords: IGridCellCoordinates, entityName: string): IGridFilesSelected {

    const files: IGridFileUpload[] = [...fileLisit].map(file => ({
      id: uuidv4(),
      file,
      progress: new BehaviorSubject(0),
      status: new BehaviorSubject<EFileUploadStatus>(EFileUploadStatus.Waiting),
      cellCoords: coords,
      entityName,
    }))

    files.forEach(f => this.addUpload(f));

    return { ...coords, files }
  }

  public getPendingUploadsForCell(coords: IGridCellCoordinates): IGridFileUpload[] {
    const output: IGridFileUpload[] = []
    if (this._uploads.size > 0) {
      output.push(...[...this._uploads.values()].filter(x => x.cellCoords.equals(coords)))
    }
    return output
  }

}

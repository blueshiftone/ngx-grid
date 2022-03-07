import { BehaviorSubject, Subject } from 'rxjs'

import { IGridCellCoordinates } from '.'
import { EFileUploadStatus } from '../enums/file-upload-status.enum'


export interface IGridFileUpload {
  id           : string
  gridId       : string
  file         : File
  progress     : BehaviorSubject<number>
  status       : BehaviorSubject<EFileUploadStatus>
  cellCoords   : IGridCellCoordinates
  uploadStream?: Subject<string>
}

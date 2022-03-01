import { BehaviorSubject } from 'rxjs'

import { IGridCellCoordinates } from '.'
import { EFileUploadStatus } from '../enums/file-upload-status.enum'


export interface IGridFileUpload {
  id             : string
  entityName     : string
  file           : File
  progress       : BehaviorSubject<number>
  status         : BehaviorSubject<EFileUploadStatus>
  cellCoords     : IGridCellCoordinates
}

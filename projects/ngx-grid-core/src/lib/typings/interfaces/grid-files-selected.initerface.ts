import { IGridCellCoordinates } from '.'
import { IGridFileUpload } from './grid-file-upload.interface'


export interface IGridFilesSelected extends IGridCellCoordinates {
  files: IGridFileUpload[]
}



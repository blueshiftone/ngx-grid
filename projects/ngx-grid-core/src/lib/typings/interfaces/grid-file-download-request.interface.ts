import { IGridCellCoordinates } from '.'
import { IGridFileCellValue } from './grid-file-cell-value.interface'

export interface IGridFileDownloadRequest {
  value: IGridFileCellValue
  cellCoordinates: IGridCellCoordinates
  gridId: string
}

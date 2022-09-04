import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EValidationSeverity, IGridCellCoordinates, IGridValueValidationResult } from '../../../../../typings/interfaces'
import { GridMetadataCollection } from '../../../../../typings/interfaces/implementations'

export interface ICellValidator {
  run(value: any): IGridValueValidationResult
}

export abstract class BaseCellValidator implements ICellValidator {

  constructor(public gridController: GridControllerService, public cellCoords: IGridCellCoordinates) {}

  public abstract validatorId: any
  public abstract run(value: any): IGridValueValidationResult

  public value  : any    = null
  public message: string = ""
  public severity        = EValidationSeverity.Error

  public return(isValid: boolean, message?: string, severity?: EValidationSeverity): IGridValueValidationResult {
    const { value } = this
    const isInvalid = !isValid
    return { 
      value,
      failed: isInvalid,
      passed: isValid,
      message: message ?? this.message,
      severity: severity ?? this.severity,
      validatorId: this.validatorId
    }
  }

  public passed(): IGridValueValidationResult {
    return this.return(true)
  }

  public error(message: string): IGridValueValidationResult {
    return this.return(false, message, EValidationSeverity.Error)
  }

  public warning(message: string): IGridValueValidationResult {
    return this.return(false, message, EValidationSeverity.Warning)
  }

  public get metadata() {
    return this.gridController.cell.GetCellMeta.run(this.cellCoords)?.metadata ?? new GridMetadataCollection()
  }

  public get colName() {
    const colMeta = this.gridController.dataSource.getColumn(this.cellCoords.columnKey)
    return colMeta?.name ?? this.cellCoords.columnKey
  }

}

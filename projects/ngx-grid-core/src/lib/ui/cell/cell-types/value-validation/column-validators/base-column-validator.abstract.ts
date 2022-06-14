import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EValidationSeverity, IGridCellCoordinates, IGridCellValidationState, IGridValueValidationResult } from '../../../../../typings/interfaces'
import { TColumnKey } from '../../../../../typings/types'

export interface IColumnValidator {
  run(column: TColumnKey): IGridValueValidationResult
}

export abstract class BaseColumnValidator implements IColumnValidator {

  public abstract validatorId: any
  public abstract run(column: TColumnKey): IGridValueValidationResult

  public message: string = ""
  public severity        = EValidationSeverity.Error

  constructor(public gridController: GridControllerService, public columnKey: TColumnKey) {}

  public patchValidationResult(cellCoordinates: IGridCellCoordinates, validationResult: IGridValueValidationResult) {
    const cellOperations  = this.gridController.cell
    const cellValue       = cellOperations.GetCellValue.run(cellCoordinates)
    const validationState: IGridCellValidationState = cellValue?.validationState ?? { cellCoordinates, previousIsValid: true, nextIsValid: validationResult.passed, validationResults: [] }
    
    const newState = {...validationState}
    newState.validationResults = [...newState.validationResults.filter(r => r.validatorId !== this.validatorId), validationResult]
    newState.previousIsValid = validationState.nextIsValid
    newState.nextIsValid = newState.validationResults.find(r => r.failed) === undefined
    
    if (cellValue) cellValue.validationState = newState
    this.gridController.gridEvents.CellValidationStateChangedEvent.emit(newState)
  }

  public return(isValid: boolean, coords: IGridCellCoordinates, message?: string, severity?: EValidationSeverity): IGridValueValidationResult {
    const value = this.gridController.cell.GetCellValue.run(coords)
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

  public passed(coords: IGridCellCoordinates): IGridValueValidationResult {
    return this.return(true, coords)
  }

  public error(message: string, coords: IGridCellCoordinates): IGridValueValidationResult {
    return this.return(false, coords, message, EValidationSeverity.Error)
  }

  public warning(message: string, coords: IGridCellCoordinates): IGridValueValidationResult {
    return this.return(false, coords, message, EValidationSeverity.Warning)
  }

}

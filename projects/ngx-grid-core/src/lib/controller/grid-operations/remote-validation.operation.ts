import { EValidationSeverity, IGridCellCoordinates, IGridOperationFactory, IGridValueValidationResult } from '../../typings/interfaces'
import { Operation } from '../operation.abstract'

export class RemoteValidation extends Operation {

  private _validationMap = new Map<string, { coordinates: IGridCellCoordinates, validation: IGridValueValidationResult<any> }[]>()

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }
  
  public addValidationResult(coordinates: IGridCellCoordinates[], message: string, severity = EValidationSeverity.Error): void {
    coordinates.forEach(coords => {
      if (!this._validationMap.has(coords.compositeKey)) {
        this._validationMap.set(coords.compositeKey, [])
      }
      const validations = this._validationMap.get(coords.compositeKey)!
      if (validations.find(v => v.validation.message === message) === undefined) {
        validations.push({
          coordinates: coords,
          validation: {
            message,
            severity,
            failed: true,
            passed: false,
            validatorId: 'remote',
            value: this.cellOperations.GetCellValue.run(coords)?.value,
            nonBlocking: true
          }
        })
      }
      this.cellOperations.ValidateCell.run(coords)
    })
    this.selection.SelectCell.run(coordinates[0]);
    this.selection.ScrollIntoView.run(coordinates[0]);
  }

  public getValidationResults(coordinates: IGridCellCoordinates): IGridValueValidationResult<any>[] {
    return this._validationMap.get(coordinates.compositeKey)?.map(v => v.validation) ?? []
  }

  public clear(): void {
    const cellCoords = [...this._validationMap.values()].map(v => v[0].coordinates)
    this._validationMap.clear()
    for (const coords of cellCoords) {
      this.cellOperations.ValidateCell.run(coords)
    }
  }

}

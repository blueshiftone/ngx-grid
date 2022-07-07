import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates, IGridValueValidationResult } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { ColumnValidatorMap } from '../../ui/cell/cell-types/value-validation/column-validators/column-validator.map'
import { ValueValidator } from '../../ui/cell/cell-types/value-validation/value-validator'
import { DistinctValues } from '../../utils/distinct-values'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class ValidateCell extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public bufferColumnValidation = new BufferOperation((args: string[][]) => this._columnValidation(args))
  
  public run(cellCoordinates: IGridCellCoordinates): IGridValueValidationResult[] {

    const cellValue         = this.cellOperations.GetCellValue.run(cellCoordinates)
    const validationResults = [
      ...this.gridOperations.RemoteValidation.getValidationResults(cellCoordinates),
      ...ValueValidator.validate(cellValue?.value, this.cellOperations.gridController, cellCoordinates),
    ]

    const previousIsValid   = this.cellOperations.GetCellIsValid.run(cellCoordinates)
    const nextIsValid       = validationResults.length === 0
    const nextState         = { cellCoordinates, validationResults, previousIsValid, nextIsValid }
    
    if (cellValue) cellValue.validationState = nextState
    if (!nextIsValid || nextIsValid != previousIsValid) this.gridEvents.CellValidationStateChangedEvent.emit(nextState)
    this.bufferColumnValidation.next([cellCoordinates.columnKey])
    return validationResults
  }

  private async _columnValidation(args: string[][]) {
    for (const col of DistinctValues(args.map(a => a[0]))) {
      const meta = this.columnOperations.GetColumnMeta.run(col)
      for (const metaDataType of meta?.metadata.getAllMetaTypes() ?? []) {
        const columnValidators = ColumnValidatorMap[EMetadataType[metaDataType] as keyof typeof EMetadataType]
        if (columnValidators) {
          for (const validator of columnValidators) {
            new validator(this.gridOperations.gridController, col).run()
          }
        }
      }
    }
  }
}

import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EMetadataType } from '../../../../../typings/enums'
import { IGridCellCoordinates, IGridValueValidationResult } from '../../../../../typings/interfaces'
import { BaseCellValidator, ICellValidator } from './base-cell-validator.abstract'

export class MaxLength extends BaseCellValidator implements ICellValidator {

  public validatorId = EMetadataType[EMetadataType.MaxLength]

  constructor(controller: GridControllerService, coords: IGridCellCoordinates) { super(controller, coords) }

  public run(value: any): IGridValueValidationResult<number> {
    this.value = value
    
    const maxLength = this.gridController.cell.GetCellMetaValue.run<number>(this.cellCoords, EMetadataType.MaxLength)

    if (maxLength !== null && typeof value === 'string' && value.length > maxLength) {
      return this.error({
        key: `locMaximumCharactersExceeded`,
        variables: {
          0: value.length,
          1: maxLength
        }
      })
    }

    return this.passed()

  }

}

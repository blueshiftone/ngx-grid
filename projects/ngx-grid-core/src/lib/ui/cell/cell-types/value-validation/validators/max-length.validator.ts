import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EMetadataType } from '../../../../../typings/enums'
import { IGridCellCoordinates, IGridValueValidationResult } from '../../../../../typings/interfaces'
import { BaseValidator, IValueValidator } from './base-validator.abstract'

export class MaxLength extends BaseValidator implements IValueValidator {

  constructor(controller: GridControllerService, coords: IGridCellCoordinates) { super(controller, coords) }

  public run(value: any): IGridValueValidationResult<number> {
    this.value = value
    
    const maxLength = this.gridController.cell.GetCellMetaValue.run<number>(this.cellCoords, EMetadataType.MaxLength)

    if (maxLength !== null && typeof value === 'string' && value.length > maxLength) {
      return this.error(`Maximum characters exceeded: ${value.length}/${maxLength}`)
    }

    return this.passed()

  }

}

import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EMetadataType } from '../../../../../typings/enums'
import { IGridCellCoordinates, IGridValueValidationResult } from '../../../../../typings/interfaces'
import { BaseCellValidator, ICellValidator } from './base-cell-validator.abstract'

export class IsRequired extends BaseCellValidator implements ICellValidator {

  public validatorId = EMetadataType[EMetadataType.IsRequired]

  constructor(controller: GridControllerService, coords: IGridCellCoordinates) { super(controller, coords) }

  public run(value: any): IGridValueValidationResult<number> {
    this.value = value
    
    const enabled = this.gridController.cell.GetCellMetaValue.run<boolean>(this.cellCoords, EMetadataType.IsRequired) === true

    if (enabled) {
      if (value === '' || value === null || value === undefined) {
        return this.warning(`locThisIsARequiredField`)
      }
    }

    return this.passed()

  }

}

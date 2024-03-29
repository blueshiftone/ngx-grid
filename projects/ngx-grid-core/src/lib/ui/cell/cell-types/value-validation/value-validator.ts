import { GridControllerService } from '../../../../controller/grid-controller.service'
import { EMetadataType } from '../../../../typings/enums'
import { IGridCellCoordinates, IGridValueValidationResult } from '../../../../typings/interfaces'
import { CellValidatorMap, TCellValidators } from './cell-validators/cell-validator.map'

export class ValueValidator {

  public static validate(
    value: any,
    gridController: GridControllerService,
    cellCoords: IGridCellCoordinates
  ): IGridValueValidationResult[] {

    const getMetaTypes = (gridController: GridControllerService, cellCoords: IGridCellCoordinates) => {
      const cellMeta = gridController.cell.GetCellMeta.run(cellCoords)?.metadata
      const colMeta = gridController.dataSource.getColumn(cellCoords.columnKey)?.metadata
      return new Set([...(cellMeta?.getAllMetaTypes() ?? []), ...(colMeta?.getAllMetaTypes() ?? [])].map(x => EMetadataType[x] as keyof typeof EMetadataType))
    }

    const output: IGridValueValidationResult[] = []

    const cellMetadata = gridController.cell.GetCellMeta.run(cellCoords)?.metadata
    if (!cellMetadata) return output

    const validators = new Set<TCellValidators>()

    for (const type of getMetaTypes(gridController, cellCoords)) {
      (CellValidatorMap[type] ?? []).forEach(validator => validators.add(validator))
    }

    for (const validator of validators) {
      const result = new validator(gridController, cellCoords).run(value)
      if (result.failed) output.push(result)
    }

    return output

  }

}

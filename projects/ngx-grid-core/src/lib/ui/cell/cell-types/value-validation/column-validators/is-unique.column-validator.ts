import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EMetadataType, ERowStatus } from '../../../../../typings/enums'
import { IGridCellValidationState, IGridCellValue } from '../../../../../typings/interfaces'
import { GridCellCoordinates } from '../../../../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { TColumnKey } from '../../../../../typings/types'
import { BaseColumnValidator, IColumnValidator } from './base-column-validator.abstract'

export class IsUnique extends BaseColumnValidator implements IColumnValidator {

  public validatorId = EMetadataType[EMetadataType.IsUnique]

  constructor(controller: GridControllerService, columnKey: TColumnKey) { super(controller, columnKey) }

  public run(): any {

    const isUnique = this.gridController.dataSource.getColumn(this.columnKey)?.metadata.get(EMetadataType.IsUnique) === true

    if (isUnique !== true) return

    const grouped = new Map<any, IGridCellValue[]>()

    const existingInvalidStates: IGridCellValidationState[] = []

    for (const row of this.gridController.dataSource.rows.firstValue) {
      const coords = new GridCellCoordinates(row.rowKey, this.columnKey)
      const cellValue = this.gridController.cell.GetCellValue.run(coords)
      if (cellValue?.validationState?.validationResults.find(v => v.validatorId === this.validatorId)?.failed === true) {
        existingInvalidStates.push(cellValue.validationState)
      }
      if (this.gridController.row.GetRowStatus.run(row.rowKey) === ERowStatus.Deleted) continue
      if (cellValue?.value !== '' && cellValue?.value !== undefined && cellValue?.value !== null) {
        if (grouped.has(cellValue.value)) {
          const existing = grouped.get(cellValue.value)
          existing?.push(cellValue)
        } else {
          grouped.set(cellValue.value, [cellValue])
        }
      }
    }

    const duplicates = [...grouped.values()].filter(cells => cells.length > 1).reduce<IGridCellValue[]>((output, el) => {
      output.push(...el)
      return output
    }, [])

    const invalidRowKeys = duplicates.map(e => e.rowKey)

    for (const state of existingInvalidStates) {
      if (!invalidRowKeys.includes(state.cellCoordinates.rowKey)) {
        const coords = new GridCellCoordinates(state.cellCoordinates.rowKey, this.columnKey)
        this.patchValidationResult(coords, this.passed(coords))
      }
    }

    for (const item of duplicates) {
      const coords = new GridCellCoordinates(item.rowKey, this.columnKey)
      this.patchValidationResult(coords, this.error('locValuesInThisColumnMustBeUnique', coords))
    }
  }
}

import { GridControllerService } from '../../../../../controller/grid-controller.service'
import { EMetadataType, ERowStatus } from '../../../../../typings/enums'
import { IGridCellValidationState, IGridCellValue } from '../../../../../typings/interfaces'
import { GridCellCoordinates } from '../../../../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { TColumnKey } from '../../../../../typings/types'
import { BaseColumnValidator, IColumnValidator } from './base-column-validator.abstract'

export class ExactlyOneRecordWithValue extends BaseColumnValidator implements IColumnValidator {

  public validatorId = EMetadataType[EMetadataType.ExactlyOneRecordWithValue]

  constructor(controller: GridControllerService, columnKey: TColumnKey) { super(controller, columnKey) }

  public run(): any {

    const colMeta = this.gridController.dataSource.getColumn(this.columnKey)

    const value = colMeta?.metadata.get(EMetadataType.ExactlyOneRecordWithValue) as any

    const cellsWithValue: IGridCellValue[] = []

    const existingInvalidStates: IGridCellValidationState[] = []

    for (const row of this.gridController.dataSource.rows.firstValue) {

      const coords = new GridCellCoordinates(row.rowKey, this.columnKey)
      const cellValue = this.gridController.cell.GetCellValue.run(coords)

      if (cellValue?.validationState?.validationResults.find(v => v.validatorId === this.validatorId)?.failed === true) {
        existingInvalidStates.push(cellValue.validationState)
      }
      
      if (cellValue?.value === value && cellValue !== null && this.gridController.row.GetRowStatus.run(row.rowKey) !== ERowStatus.Deleted) {
        cellsWithValue.push(cellValue)
      }
    }

    for (const state of existingInvalidStates) {
      const coords = new GridCellCoordinates(state.cellCoordinates.rowKey, this.columnKey)
      this.patchValidationResult(coords, this.passed(coords))
    }

    if (cellsWithValue.length > 1) {

      const focusedCell = this._getFocusedCell()

      if (colMeta?.type?.name === 'Boolean' && focusedCell !== undefined) {
        
        const rowKey = focusedCell.rowKey

        for (const row of this.gridController.dataSource.rows.firstValue) {

          if (row.rowKey !== rowKey && row.getValue(this.columnKey).value === value) {
            const coords = new GridCellCoordinates(row.rowKey, this.columnKey)
            this.gridController.cell.SetCellValue.run(coords, false)
            this.gridController.cell.SetCellDraftValue.buffer(coords)
            this.gridController.cell.CellComponents.findWithCoords(coords)?.detectChanges()
          }
        }
      } else {

        for (const item of cellsWithValue) {
          const coords = new GridCellCoordinates(item.rowKey, this.columnKey)
          this.patchValidationResult(coords, this.error(`locThisColumnMustContainOnlyOneCellWithTheValueOf\${ '${value}'}`, coords))
        }

      }
    } else if (cellsWithValue.length === 0) {
      for (const row of this.gridController.dataSource.rows.firstValue) {
        const coords = new GridCellCoordinates(row.rowKey, this.columnKey)
        this.patchValidationResult(coords, this.error(`locOneCellInThisColumnMustHaveTheValueOf\${ '${value}'}`, coords))
      }
    }
  }

  private _getFocusedCell() {
    return this.gridController.gridEvents.CellFocusChangedEvent.state
  }
}

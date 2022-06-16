import { EMetadataType } from '../../typings/enums'
import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { IGridStyle } from '../../typings/interfaces/grid-style.interface'
import { WithDefaultTrue } from '../../utils/with-default-true'
import { Operation } from '../operation.abstract'

export class SetCellStylesFromMeta extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(cell: IGridCellComponent): void {
    const cellValidationState = this.cellOperations.GetCellValue.run(cell.coordinates)?.validationState
    const isValid = WithDefaultTrue(cellValidationState?.nextIsValid)
    cell.toggleClass('is-invalid', !isValid)
    const validationClass = [...cell.element.classList.values()].find(c => c.includes('validation-id-'))
    if (validationClass !== undefined) {
      cell.toggleClass(validationClass, false)
    }
    if (cellValidationState !== undefined) {
      cellValidationState.validationResults.forEach(r => {
        cell.toggleClass(`validation-id-${r.validatorId}`, true)
      })
    }
    cell.toggleClass('is-editable', this.cellOperations.GetCellIsEditable.run(cell.coordinates) ?? false)
    cell.toggleClass('has-draft-value', this.cellOperations.HasDraftValue.run(cell.coordinates))
    cell.style.backgroundColor = this.cellOperations.GetCellMetaValue.run<IGridStyle>(cell.coordinates, EMetadataType.Style)?.backgroundColor?.toString() ?? ''
  }
  
}

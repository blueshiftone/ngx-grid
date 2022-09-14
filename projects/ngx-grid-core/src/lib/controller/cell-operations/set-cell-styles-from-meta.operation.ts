import { ECellActivityState, EMetadataType } from '../../typings/enums'
import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { IGridStyle } from '../../typings/interfaces/grid-style.interface'
import { WithDefaultTrue } from '../../utils/with-default'
import { Operation } from '../operation.abstract'

export class SetCellStylesFromMeta extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(cell: IGridCellComponent): void {

    cell.toggleClass('is-editable', this.cellOperations.GetCellIsEditable.run(cell.coordinates) ?? false)
    cell.toggleClass('has-draft-value', this.cellOperations.HasDraftValue.run(cell.coordinates))
    cell.style.backgroundColor = this.cellOperations.GetCellMetaValue.run<IGridStyle>(cell.coordinates, EMetadataType.Style)?.backgroundColor?.toString() ?? ''

    // Classes relating to cell validation
    const cellValidationState = this.cellOperations.GetCellValue.run(cell.coordinates)?.validationState
    const isValid = WithDefaultTrue(cellValidationState?.nextIsValid)
    cell.toggleClass('is-invalid', !isValid)
    cell.toggleClass('hide-value', this.cellOperations.GetCellMetaValue.run<boolean>(cell.coordinates, EMetadataType.HideValue) === true)
    const validationClasses = [...cell.element.classList.values()].filter(c => c.includes('validation-id-'))
    validationClasses.forEach(className => cell.toggleClass(className, false))
    if (cellValidationState !== undefined) {
      cellValidationState.validationResults.forEach(r => {
        cell.toggleClass(`validation-id-${r.validatorId}`, true)
      })
    }

    // Cell activity state
    const activityState = this.cellOperations.GetCellMeta.run(cell.coordinates)?.activityState
    cell.toggleClass(`activity-locked`, activityState === ECellActivityState.Locked)
    cell.toggleClass(`activity-idle`, activityState === ECellActivityState.Idle || activityState === undefined)
    
  }
  
}

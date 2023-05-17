import { EPositionPreference } from '../../typings/enums'
import { EGridOverlayType } from '../../typings/enums/grid-overlay-type.enum'
import { IGridCellValidationState } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { CellValidationMessageComponent } from '../../ui/grid-overlays/cell-validation-message/cell-validation-message.component'
import { Operation } from '../operation.abstract'

export class SetCellValidationDialog extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }
  
  public run(event: IGridCellValidationState) {

    const { cellCoordinates, validationResults, nextIsValid } = event

    const cellComponent     = this.cellOperations.CellComponents.findWithCoords(cellCoordinates)
    const focusedCell       = this.cellOperations.GetFocusedCell.run()
    const hasCellComponent  = typeof cellComponent?.typeComponent !== 'undefined'

    const canEdit = this.cellOperations.GetCellIsEditable.run(cellCoordinates)

    if (!canEdit) return

    if (!nextIsValid && hasCellComponent) {

      if (typeof focusedCell !== 'undefined' && focusedCell === cellComponent) {

        const cellTypeComponent = cellComponent.typeComponent!      

        cellComponent.overlays.open(cellTypeComponent, EGridOverlayType.CellValidationMessage, {
          data: validationResults, 
          positionPreference: EPositionPreference.VerticalBottom,
          flexibleDimensions: true
        }, this.cellOperations.CellComponents.findWithCoords(cellCoordinates)?.viewContainerRef ?? null)

      }

    }

    if (nextIsValid && hasCellComponent && focusedCell && focusedCell === cellComponent) {
      cellComponent.overlays.closeComponent(CellValidationMessageComponent)
    }

    return validationResults
  }

}


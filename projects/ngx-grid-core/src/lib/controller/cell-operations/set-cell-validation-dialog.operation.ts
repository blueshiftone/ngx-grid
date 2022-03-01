import { EPositionPreference } from '../../typings/enums'
import { IGridCellValidationState } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { CellValidationMessageComponent } from '../../ui/grid-overlays/cell-validation-message/cell-validation-message.component'
import { EGridOverlayTypes } from '../../ui/grid-overlays/grid-overlay-types'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class SetCellValidationDialog extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }
  
  public run(event: IGridCellValidationState,) {

    const { cellCoordinates, validationResults, nextIsValid } = event

    const cellComponent     = this.cellOperations.CellComponents.findWithCoords(cellCoordinates)
    const focusedCell       = this.cellOperations.GetFocusedCell.run()
    const hasCellComponent  = typeof cellComponent?.typeComponent !== 'undefined'

    if (!nextIsValid && hasCellComponent) {

      if (typeof focusedCell !== 'undefined' && focusedCell === cellComponent) {

        const cellTypeComponent = cellComponent.typeComponent!

        cellComponent.overlays.open(cellTypeComponent, EGridOverlayTypes.CellValidationMessage, {
          data: validationResults, 
          positionPreference: EPositionPreference.VerticalBottom,
          flexibleDimensions: true
        })

      }

    }

    if (nextIsValid && hasCellComponent && focusedCell && focusedCell === cellComponent) {
      cellComponent.overlays.closeComponent(CellValidationMessageComponent)
    }

    return validationResults
  }

}


import { GridControllerService } from '../../../../controller/grid-controller.service'
import { IGridCellCoordinates, IValueMultiEdit } from '../../../../typings/interfaces'
import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'

export abstract class BaseMultiEdit implements IValueMultiEdit {
  
  public abstract label                 : string
  public longLabel?                     : string
  public abstract run<T = any>(input: T): void
  public requiresInput  = true

  private _gridController?: GridControllerService
  private _cellCoordinates?          : IGridCellCoordinates

  constructor(public cellValue: any, public cellType: TCellTypeName) {}

  public initialize(gridController: GridControllerService, cellCoordinates: IGridCellCoordinates) {
    this._gridController  = gridController
    this._cellCoordinates = cellCoordinates
  }

  public setCellValue(value: any) {
    if (!this._gridController || !this._cellCoordinates) return
    let validationResult = this._gridController.cell.SetCellValue.run(this._cellCoordinates, value)
    if (validationResult.isValid) {
      const component = this._gridController.cell.CellComponents.findWithCoords(this._cellCoordinates)
      if (component) component.setValue(validationResult.transformedValue)
      this._gridController.cell.SetCellDraftValue.buffer(this._cellCoordinates)
    }
    return validationResult.isValid
  }
}

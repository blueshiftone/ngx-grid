import { IGridCellComponent, IGridSelectionRange } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class SelectedCellsChanged extends Operation {
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public run(selection: [IGridSelectionRange | undefined | null, IGridSelectionRange | undefined | null]): void {
    const [prevSelection, nextSelection] = selection

    const allCells = new Set([
      ...Array.from(nextSelection?.allCellCoordinates() || []),
      ...Array.from(nextSelection?.secondarySelection?.allCellCoordinates() || []),
      ...Array.from(prevSelection?.allCellCoordinates() || []),
      ...Array.from(prevSelection?.secondarySelection?.allCellCoordinates() || []),
    ])

    const cells: IGridCellComponent[] = this.cellOperations.CellComponents.filterWithCoordsIn(allCells)

    cells.forEach(cell => this.cellOperations.SetCellSelectionClasses.run(cell, nextSelection))

  }

}

import { IGridCellCoordinates, ISelectionController } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { Clipboard } from '../../../utils/clipboard.class'
import { ExcelFormatter } from '../../../utils/excel-formatter.class'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class CopySelection extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) {
    super(controller)
  }

  public async run(options?: ICopySelectionOptions): Promise<void> {

    let slice = this.controller.GetSelectionSlice.run()
    if (options?.allColumns)
    {
        const coordinateRanges: [IGridCellCoordinates, IGridCellCoordinates][] = [];
        const columns = this.controller.gridController.dataSource.columns
        if (!slice) return

        for (const rowKey of slice.selection.rowKeys) {
            // Add coordinates (start -> end cell) for each row
            coordinateRanges.push([new GridCellCoordinates(rowKey, columns[0].columnKey), new GridCellCoordinates(rowKey, columns[columns.length - 1].columnKey)])
        }
        // Create new selection
        const newSelection = this.controller.CreateSelectionStateFromCoordinates.run(coordinateRanges[0]);
        // Add coordinates
        for (const coordinateRange of coordinateRanges) {
            newSelection.currentSelection.addRange(...coordinateRange)
        }
        slice = this.controller.GetSelectionSlice.run(newSelection.currentSelection) ?? slice
    }
    if (!slice) return

    const formatter = new ExcelFormatter(this.controller.gridController, slice)

    const html = formatter.toExcelHTML(options?.withHeaders)
    const plain = formatter.toPlainText(options?.withHeaders)
    
    await new Clipboard()
      .setHTML(html)
      .setPlainText(plain)
      .write()

    this.controller.gridEvents.GridDataCopiedEvent.emit(true)
    
  }

}

export interface ICopySelectionOptions {
  withHeaders?: boolean
  allColumns?: boolean
}

import { Clipboard } from '../../../utils/clipboard.class'
import { ExcelFormatter } from '../../../utils/excel-formatter.class'
import { GridSelectionController } from '../grid-selection.controller'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class CopySelectionOperation extends BaseSelectionOperation {

  constructor(private readonly controller: GridSelectionController) {
    super(controller)
  }

  public async run(): Promise<void> {

    const slice = this.controller.getSelectionSlice()

    if (!slice) return

    const formatter = new ExcelFormatter(this.controller.gridController, slice)

    const html = formatter.toExcelHTML()
    const plain = formatter.toPlainText()
    
    await new Clipboard()
      .setHTML(html)
      .setPlainText(plain)
      .write()

    this.controller.gridEvents.GridDataCopiedEvent.emit(true)
    
  }

}

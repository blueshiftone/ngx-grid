import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowPreviewString extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): string {
    const row    = this.rowOperations.GetRow.run(rowKey)
    let   output = this.dataSource.rowTemplateString
    if (typeof output === 'undefined') {
      console.error(`RowPreviewTemplateString not set for grid ${this.gridOperations.GetGridId.run()}`);
      return '(preview not available)'
    }
    for (const col of this.dataSource.columns) {
      if (output.includes(col.columnKey)) {
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col.columnKey}(?:\\s+)?\\}\\}`, 'g')
        output = output.replace(regex, row?.getValue(col.columnKey)?.value ?? col)
      }
    }
    return output
  }

}

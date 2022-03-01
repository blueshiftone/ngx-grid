import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseRowOperation } from './base-row-operation.abstract'

export class GetRowPreviewString extends BaseRowOperation {

  constructor(factory: IRowOperationFactory) { super(factory) }

  public run(rowKey: TPrimaryKey): string {
    const row    = this.rowOperations.GetRow.run(rowKey)
    let   output = this.gridOperations.source()?.rowPreviewTemplateString
    if (typeof output === 'undefined') {
      console.error(`RowPreviewTemplateString not set for grid ${this.gridOperations.GetGridId.run()}`);
      return '(preview not available)'
    }
    const columns = this.gridOperations.source()?.data.value.columns ?? []
    for (const col of columns) {
      if (output.includes(col)) {
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col}(?:\\s+)?\\}\\}`, 'g')
        output = output.replace(regex, row?.getValue(col)?.value ?? col)
      }
    }
    return output
  }

}

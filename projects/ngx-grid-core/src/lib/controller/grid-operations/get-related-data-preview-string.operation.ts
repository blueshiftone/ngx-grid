import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class GetRelatedDataPreviewString extends BaseGridOperation {

  constructor(
    factory: IGridOperationFactory
  ) { super(factory) }

  public run(gridID: string, rowKey: TPrimaryKey): string {
    const grid = this.gridOperations.relatedDataMap.get(gridID)
    const row = grid?.rowMap.get(rowKey)
    if (!grid || !row) return (rowKey ?? '').toString()
    let outputString = grid.source.rowPreviewTemplateString
    const columns = grid.source.data.value.columns
    for (const col of columns) {
      if (outputString.includes(col)) {
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col}(?:\\s+)?\\}\\}`, 'g')
        outputString = outputString.replace(regex, row.getValue(col)?.value)
      }
    }
    return outputString
  }
}

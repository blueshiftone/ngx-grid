import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRelatedDataPreviewString extends Operation {

  constructor(
    factory: IGridOperationFactory
  ) { super(factory.gridController) }

  public run(gridID: string, rowKey: TPrimaryKey): string {
    const grid = this.gridOperations.relatedDataMap.get(gridID)
    const row = grid?.rowMap.get(rowKey)
    if (!grid || !row) return (rowKey ?? '').toString()
    let outputString = grid.source.rowTemplateString
    for (const col of grid.source.columns) {
      if (outputString.includes(col)) {
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col}(?:\\s+)?\\}\\}`, 'g')
        outputString = outputString.replace(regex, row.getValue(col)?.value)
      }
    }
    return outputString
  }
}

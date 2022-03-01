import { IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { BaseGridOperation } from './base-grid-operation.abstract'

export class UpdateRelatedDataMap extends BaseGridOperation {

  constructor(factory: IGridOperationFactory) { super(factory) }

  public run() {
    if (!this.gridOperations.source) return
    this.gridOperations.relatedDataMap.clear()
    for (const entry of this.gridOperations.source().relatedData.entries()) {

      const [gridID, source]        = entry
      const rowMap: Map<TPrimaryKey, IGridRow> = new Map()
      
      source.data.value.rows.forEach(row => rowMap.set(row.rowKey, row))
      this.gridOperations.relatedDataMap.set(gridID, { source: source, rowMap: rowMap })

    }
  }

}

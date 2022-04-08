import { IGridDataSource, IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class UpdateRelatedDataMap extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(sources:[string, IGridDataSource][] = [...this.dataSource.relatedData.entries()]) {
    if (!this.dataSource) return
    this.gridOperations.relatedDataMap.clear()
    for (const entry of sources) {

      const [gridID, source]        = entry
      const rowMap: Map<TPrimaryKey, IGridRow> = new Map()
      
      source.rows.forEach(row => rowMap.set(row.rowKey, row))
      this.gridOperations.relatedDataMap.set(gridID, { source: source, rowMap: rowMap })

    }
  }

}

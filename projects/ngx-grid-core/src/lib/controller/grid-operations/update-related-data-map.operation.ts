import { IGridDataSource, IGridRow } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class UpdateRelatedDataMap extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(sources?:[string, IGridDataSource][]) {
    if (!this.dataSource) return
    if (sources === undefined) {
      sources = [...this.dataSource.relatedData.entries()]
      this.gridOperations.relatedDataMap.clear()
    }

    for (const entry of sources) {

      const [gridID, source] = entry
      const rowMap: Map<TPrimaryKey, IGridRow> = new Map()
      
      source.rows.firstValue.forEach(row => rowMap.set(row.rowKey, row))
      this.gridOperations.relatedDataMap.set(gridID, { source, rowMap })

    }
  }

}

import { IGridDataSource } from '../../typings/interfaces'
import { IGridOperationFactory } from '../../typings/interfaces/grid-operation-factory.interface'
import { Operation } from '../operation.abstract'

export class UpdateRelatedDataSources extends Operation {

  constructor(factory: IGridOperationFactory) { super(factory.gridController) }

  public run(sources?:[string, IGridDataSource][]) {
    if (!this.dataSource) return
    if (sources === undefined) {
      sources = [...this.dataSource.relatedData.entries()]
      this.gridOperations.relatedDataSources.clear()
    }

    for (const entry of sources) {
      const [gridID, source] = entry
      this.gridOperations.relatedDataSources.set(gridID, source)
    }
  }

}

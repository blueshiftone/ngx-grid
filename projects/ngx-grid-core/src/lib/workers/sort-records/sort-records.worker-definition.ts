import { IFieldSortConfig, IGridRow } from '../../typings/interfaces'
import { WorkerDefinition } from '../worker-definition.abstract'

export interface ISortRecordsInput {
  records: IGridRow[],
  sortConfig: IFieldSortConfig[]
}

export class SortRecords extends WorkerDefinition<ISortRecordsInput, IGridRow[]> {

  protected getWorker() {
    return new Worker(new URL(`./sort-records.worker`, import.meta.url))
  }

}

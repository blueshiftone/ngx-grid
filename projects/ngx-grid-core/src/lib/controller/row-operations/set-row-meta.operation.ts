import { IGridMetadataCollection } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class SetRowMeta extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey, meta: IGridMetadataCollection): void {
    
    const row = this.dataSource.getRow(rowKey)
    if (!row) return

    row.metadata.extend(meta)

    this.gridEvents.MetadataChangedEvent.emit({ rowKey })

  }

}

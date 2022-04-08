import { ERowStatus } from '../../typings/enums'
import { IGridRowMeta } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class SetRowMeta extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey, input: Partial<Pick<IGridRowMeta, 'metadata' | 'rowKey' | 'status' | 'separators'>>): void {
    
    const rowMeta: IGridRowMeta = this.rowOperations.GetRowMeta.run(rowKey) ?? GridImplementationFactory.gridRowMeta({ rowKey })

    const status = input.status as ERowStatus | keyof typeof ERowStatus
    if (typeof status === 'string') input.status = ERowStatus[status]
    
    if (input.metadata) {
      input.metadata.items.forEach(x => rowMeta.metadata.set(x.key, x.value))
      delete input.metadata;
    }

    Object.assign(rowMeta, input)

    if (rowMeta.isDirty)                                  this.rowOperations.dirtyRowsMap.set(rowKey, rowMeta)
    else if(this.rowOperations.dirtyRowsMap.has(rowKey)) this.rowOperations.dirtyRowsMap.delete(rowKey)

    this.dataSource.rowMeta.set(rowKey, rowMeta)
    
  }

}

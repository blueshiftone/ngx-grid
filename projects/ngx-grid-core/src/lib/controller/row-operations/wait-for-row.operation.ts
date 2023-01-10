import { firstValueFrom, merge, timer } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class WaitForRow extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): Promise<boolean> {
    return firstValueFrom(merge(
      this.gridEvents.GridDataChangedEvent.on().pipe(filter(_ => this.dataSource.rowExists(rowKey)), map(_ => true)),
      timer(2000).pipe(map(_ => false))
    ))
  }

}

import { filter, take, timeout } from 'rxjs/operators'

import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class WaitForRow extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(rowKey: TPrimaryKey): Promise<void> {
    return new Promise(resolve => {
      this.gridEvents.GridDataChangedEvent.on()
        .pipe(filter(_ => typeof this.rowOperations.GetRow.run(rowKey) !== 'undefined'), timeout(2000), take(1))
        .subscribe(_ => resolve())
    })
  }

}

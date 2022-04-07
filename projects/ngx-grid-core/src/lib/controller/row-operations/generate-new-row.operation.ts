import { v4 as uuidv4 } from 'uuid'

import { IGridCellValue, IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates, GridCellValue } from '../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from '../../typings/types'
import { Operation } from '../operation.abstract'


export class GenerateNewRow extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  public run(): IGridRow {
    const cols          = this.dataSource.columns
    const rowKey        = uuidv4();
    const columnKey     = this.dataSource.primaryColumnKey
    const values        = [cols.map<[TColumnKey, IGridCellValue]>(col => ([col, new GridCellValue(new GridCellCoordinates(rowKey, columnKey), null)]))]
    const row: IGridRow = GridImplementationFactory.gridRow(columnKey, new Map<TColumnKey, IGridCellValue>(...values))
    row.setValue(columnKey, rowKey)
    return row
  }
}

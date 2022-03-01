import { GridCellCoordinates, GridCellValue } from '.'
import { IGridCellValue } from '..'
import { TColumnKey, TPrimaryKey, TRowValues } from '../../types'
import { IGridRow } from '../grid-row.interface'

export class GridRow implements IGridRow {

  public values: TRowValues

  private _primaryKeyColumn: TColumnKey

  constructor(primaryKeyColumn: TColumnKey, values: TRowValues) {
    this._primaryKeyColumn = primaryKeyColumn
    this.values            = values
  }

  public get rowKey(): TPrimaryKey {
    return this.getValue(this._primaryKeyColumn)?.value
  }

  public get valuesArray(): { columnKey: TColumnKey, value: IGridCellValue }[] {
    return [...this.values.entries()].map(entry => ({ columnKey: entry[0], value: entry[1] }))
  }

  public getValue(columnKey: string): IGridCellValue {
    return this.values.get(columnKey) ?? new GridCellValue(new GridCellCoordinates(columnKey ? this.rowKey : columnKey, columnKey), null)
  }

  public setValue(columnKey: string, value: any): any {
    if (!this.values.has(columnKey)) this.values.set(columnKey, new GridCellValue(new GridCellCoordinates(this.rowKey, columnKey), value))
    this.values.get(columnKey)!.value = value
  }

  public clone(): IGridRow {
    return new GridRow(
      this._primaryKeyColumn,
      new Map<TColumnKey, IGridCellValue>(this.valuesArray.map(itm => ([itm.columnKey, itm.value.clone()])))
    )
  }

}

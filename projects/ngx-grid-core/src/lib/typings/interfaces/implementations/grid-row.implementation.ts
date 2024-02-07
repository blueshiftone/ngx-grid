import { GridCellCoordinates, GridCellValue, GridMetadataCollection } from '.'
import { IGridCellValue, IGridMetadataCollection, IGridMetadataInfo, IGridSeparator } from '..'
import { DeepClone } from '../../../utils/deep-clone'
import { EMetadataType, ERowStatus } from '../../enums'
import { TColumnKey, TPrimaryKey, TRowValues } from '../../types'
import { IGridRow, IGridRowFloatingTitle } from '../grid-row.interface'

export class GridRow implements IGridRow {

  public values: TRowValues

  public separators?  : IGridSeparator[] | undefined
  public status       : ERowStatus                   = ERowStatus.Committed
  public metadata     : IGridMetadataCollection      = new GridMetadataCollection();
  public floatingTitle: IGridRowFloatingTitle | null = null

  private _primaryKeyColumn: TColumnKey

  constructor(primaryKeyColumn: TColumnKey, values: TRowValues, status = ERowStatus.Committed, metadata?: IGridMetadataCollection) {
    this._primaryKeyColumn = primaryKeyColumn
    this.values            = values
    this.status            = status
    this.metadata          = metadata ?? this.metadata
  }

  public toString(): string {
    return JSON.stringify(this.toJSON())
  }

  public toJSON<T = { [key: string]: any }>() {
    const output: any = {}
    this.valuesArray.forEach(itm => output[itm.columnKey] = itm.value.value)
    return output as T
  }

  public get rowKey(): TPrimaryKey {
    return this.values.get(this._primaryKeyColumn)?.value ?? ''
  }

  public get valuesArray(): { columnKey: TColumnKey, value: IGridCellValue }[] {
    return [...this.values.entries()].map(entry => ({ columnKey: entry[0], value: entry[1] }))
  }

  public getValue(columnKey: string): IGridCellValue {
    let cellValue = this.values.get(columnKey)
    if (!cellValue) {
      cellValue = new GridCellValue(new GridCellCoordinates(columnKey ? this.rowKey : columnKey, columnKey), null)
      this.values.set(columnKey, cellValue)
    }
    return cellValue
  }

  public setValue(columnKey: string, value: any): void {
    if (!this.values.has(columnKey)) this.values.set(columnKey, new GridCellValue(new GridCellCoordinates(this.rowKey, columnKey), value))
    this.values.get(columnKey)!.value = value
  }

  public get isDirty()  : boolean { return this.status !== ERowStatus.Committed }
  public get isNew()    : boolean { return this.status === ERowStatus.New }
  public get isDeleted(): boolean { return this.status === ERowStatus.Deleted }
  
  public get canDelete(): boolean | null {
    return this.metadata.get<boolean>(EMetadataType.CanDelete)
  }

  public get canUpdate(): boolean | null {
    return this.metadata.get<boolean>(EMetadataType.CanUpdate)
  }

  public clone(newPrimaryKey?: TPrimaryKey): IGridRow {
    return new GridRow(
      this._primaryKeyColumn,
      new Map<TColumnKey, IGridCellValue>(this.valuesArray.map(itm => {
        var newValue = itm.value.clone()
        if(newPrimaryKey) {
            newValue.rowKey = newPrimaryKey
            if (itm.columnKey === this._primaryKeyColumn) {
                newValue.value = newPrimaryKey
            }
        }
        return [itm.columnKey, newValue]
      })),
      this.status,
      new GridMetadataCollection(this.metadata.items.map<IGridMetadataInfo>(itm => DeepClone(itm)))
    )
  }

}

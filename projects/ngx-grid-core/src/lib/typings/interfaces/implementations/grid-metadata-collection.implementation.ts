import { IGridMetadataCollection, IGridMetadataInfo as IGridMetadataInfoConverted } from '..'
import { GridStyle } from '../../../styles/grid-style.implementation'
import { EMetadataType } from '../../enums'

interface IPropertyMetadataInfoRaw {
  key  : keyof typeof EMetadataType
  value: any
}


export class GridMetadataCollection implements IGridMetadataCollection
{

  private _metadata: Set<IGridMetadataInfoConverted>

  constructor(metadata: IGridMetadataInfoConverted[] = []) {
    this._metadata = new Set(metadata)
  }

  public static fromRawMetadata(metadata: IPropertyMetadataInfoRaw[]): IGridMetadataCollection
  {
    const converted = (metadata ?? []).map<IGridMetadataInfoConverted>(x => {
      const key = EMetadataType[x.key]
      let value = x.value
      switch (key) {
        case EMetadataType.Style:
          value = value ? GridStyle.fromKey(value) : null
          break;
      }
      return { key, value }
    })
    return new GridMetadataCollection(converted)
  }

  public get<T>(type: EMetadataType): T | null {
    return ([...this._metadata].find(x => x.key === type)?.value as T) ?? null
  }

  public set<T>(type: EMetadataType, value: T): void {
    let metadata = [...this._metadata].find(x => x.key === type) ?? { key: type, value }
    metadata.value = value
    this._metadata.add(metadata)
  }

  public get items() { return [...this._metadata] }

  public clear(type?: EMetadataType): void {
    if (type) {
      const existing = [...this._metadata].find(x => x.key === type)
      if (existing) this._metadata.delete(existing)
    }
    else this._metadata.clear()
  }

  public getAllMetaTypes(): EMetadataType[] {
    return this.items.map(x => x.key)
  }

}

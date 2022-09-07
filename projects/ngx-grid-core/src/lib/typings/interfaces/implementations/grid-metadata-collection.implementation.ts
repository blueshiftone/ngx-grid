import { IGridMetadataCollection, IGridMetadataInfo as IGridMetadataInfoConverted } from '..'
import { GridStyle } from '../../../styles/grid-style.implementation'
import { EMetadataType } from '../../enums'

interface IPropertyMetadataInfoRaw {
  key  : keyof typeof EMetadataType
  value: any
}

export class GridMetadataCollection implements IGridMetadataCollection
{

  private _metadata = new Map<EMetadataType, any>()

  constructor(metadata: IGridMetadataInfoConverted[] = []) {
    metadata.forEach(m => this._metadata.set(m.key, m.value))
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
    return this._metadata.get(type) ?? null
  }

  public set<T>(type: EMetadataType, value: T): void {
    this._metadata.set(type, value)
  }

  public extend (meta: IGridMetadataCollection): void {
    meta.getAllMetaTypes().forEach(type => this.set(type, meta.get(type)))
  }

  public get items() { return [...this._metadata.entries()].map(e => ({ key: e[0], value: e[1] })) }

  public clear(type?: EMetadataType): void {
    if (type) this._metadata.delete(type)
    else this._metadata.clear()
  }

  public getAllMetaTypes(): EMetadataType[] {
    return this.items.map(x => x.key)
  }

}

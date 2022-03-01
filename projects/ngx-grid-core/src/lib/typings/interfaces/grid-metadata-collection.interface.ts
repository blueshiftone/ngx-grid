import { IGridMetadataInfo } from '.'
import { EMetadataType } from '../enums'

export interface IGridMetadataCollection {
  get<T>(type: EMetadataType): T | null
  set<T>(type: EMetadataType, value: T): void
  clear(type?: EMetadataType): void
  getAllMetaTypes(): EMetadataType[]
  items: IGridMetadataInfo[]
}

import { GridMetadataCollection } from '.'
import { IGridMetadataCollection, IGridRowMeta } from '..'
import { EMetadataType } from '../../enums'
import { ERowStatus } from '../../enums/row-status.enum'
import { TPrimaryKey } from '../../types'
import { IGridSeperator } from '../grid-seperator.interface'

export class GridRowMeta implements IGridRowMeta {
  public seperators?: IGridSeperator[] | undefined
  public rowKey     : TPrimaryKey = ''
  public status     : ERowStatus  = ERowStatus.Committed
  public metadata   : IGridMetadataCollection = new GridMetadataCollection();

  constructor(meta: Partial<Pick<IGridRowMeta, 'rowKey' | 'status' | 'seperators'>>) {
    Object.assign(this, meta)
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

}
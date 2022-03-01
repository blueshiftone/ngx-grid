import { BehaviorSubject } from 'rxjs'
import { first } from 'rxjs/operators'

import { EMetadataType } from './typings/enums'
import {
  IGridCellMeta,
  IGridColumnMeta,
  IGridDataSource,
  IGridMetadataCollection,
  IGridRawData,
  IGridRowMeta,
  IGridSeperator,
} from './typings/interfaces'
import { GridMetadataCollection } from './typings/interfaces/implementations'
import { Randomish } from './utils/randomish'

export class GridDataSource implements IGridDataSource {

  public dataSetName                      = ''
  public dataGridID                       = ''
  public data                             = new BehaviorSubject<IGridRawData>({ columns: [], rows: [] })
  public primaryColumnKey                 = 'ID'
  public visibleColumns: string[]         = []
  public hiddenColumns: string[]          = []
  public disabled                         = false
  public columnMeta: IGridColumnMeta[]    = []
  public seperators: IGridSeperator[]     = []
  public maskNewIds: boolean              = false
  
  public relatedData: Map<string,          IGridDataSource> = new Map()
  public cellMeta   : Map<string,          IGridCellMeta>   = new Map()
  public rowMeta    : Map<string | number, IGridRowMeta>    = new Map()

  public metadata: IGridMetadataCollection = new GridMetadataCollection()

  public get rowPreviewTemplateString(): string {
    return this.metadata.get<string>(EMetadataType.RecordPreviewTemplateString) ?? ""
  }
  
  public get canUpdate(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanUpdate) ?? true
  }

  public get canDelete(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanDelete) ?? true
  }

  public get canInsert(): boolean {
    return this.metadata.get<boolean>(EMetadataType.CanInsert) ?? true
  }

  public static cloneMeta(g: IGridDataSource, input?: Partial<IGridDataSource>) {
    const props: Partial<IGridDataSource> = {
      dataGridID      : g.dataGridID,
      dataSetName     : g.dataSetName,
      primaryColumnKey: g.primaryColumnKey,
      visibleColumns  : g.visibleColumns,
      hiddenColumns   : g.hiddenColumns,
      disabled        : g.disabled,
      columnMeta      : g.columnMeta,
      metadata        : g.metadata,
      seperators      : g.seperators,
      cellMeta        : g.cellMeta,
      rowMeta         : g.rowMeta,
    }
    if (typeof input?.dataGridID === 'undefined'){
      props.dataGridID = `${g.dataGridID}-clone-${Randomish()}`
    }
    return new GridDataSource(Object.assign(props, input))
  }

  public static cloneSource(g: IGridDataSource, input?: Partial<IGridDataSource>) {
    const source = GridDataSource.cloneMeta(g, input)
    const rows   = g.data.value.rows.map(row => row.clone())
    source.data.next({
      columns: [...g.data.value.columns],
      rows: rows
    })
    return source
  }

  constructor(input?: Partial<IGridDataSource>) {
    if (input) Object.assign(this, input)
    this.data.pipe(first(v => v.columns.length > 0)).subscribe(data => {
      if (!this.visibleColumns.length) this.visibleColumns.push(...data.columns)
    })
  }

  public get allColumnKeys(): string[] {
    return this.data.value.columns
  }

}

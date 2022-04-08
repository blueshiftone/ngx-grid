import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, repeat, takeUntil } from 'rxjs/operators'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GridDataSource } from '../../../grid-data-source'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridDataSource, IGridOverlayData, IGridRecordSelectedEvent } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'
import { DeleteFromArray } from '../../../utils/array-delete'
import { DistinctValues } from '../../../utils/distinct-values'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'data-grid-multi-select-grid-selected-list',
  templateUrl: './multi-select-grid-selected-list.component.html',
  styleUrls: ['./multi-select-grid-selected-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectGridSelectedListComponent extends BaseOverlayComponent implements OnInit {

  public dataSource?: IGridDataSource
  public values     : TPrimaryKey[] = []
  public dataSetName                = ''

  public gridConfig = new DataGridConfigs().withRowMultiSelect()
  
  private _valueUpdated = new Subject<void>()
  private _updateDataNext = new Subject<any>()

  @Output() public selected = new EventEmitter()

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef,
  ) { super(data, cd) }

  override ngOnInit(): void {
    super.ngOnInit()
    
    const gridID = this._relatedGridID
    if (typeof gridID === 'undefined') return 
    
    const gridSource = this.gridController.grid.GetRelatedData.run(gridID)
    if (typeof gridSource === 'undefined') return 

    this.dataSetName = gridSource.dataSetName
    this.dataSource  = GridDataSource.cloneMeta(gridSource, { disabled: !this.editable })

    this._updateData()

    this.cd.detectChanges()

    this.addSubscription(this.cell.valueChanged.pipe(takeUntil(this._valueUpdated), repeat()).subscribe(_ => {
      this._updateDataNext.next(this.cell.value)
    }))

    this.addSubscription(this._updateDataNext.pipe(debounceTime(100)).subscribe(newVal => {
      this._updateData(newVal)
    }))

    this.addSubscription(this.gridController.localize.changes.subscribe(_ => this.cd.detectChanges()))
  }

  private _updateData(val = this.cell.value): void {

    if (val === null) {
      this._clearDataSource()
      this.cd.detectChanges()
      return
    }
    
    if (!this.dataSource) return

    const gridID = this._relatedGridID
    if (typeof gridID === 'undefined') return 
    
    const gridSource = this.gridController.grid.GetRelatedData.run(gridID)
    if (typeof gridSource === 'undefined') return 

    val = val ?? []

    const primaryKeyValues = DistinctValues<any>(val)
    this.values = primaryKeyValues

    this.dataSource.clearData()
    this.dataSource.upsertRows(...this.gridController.grid.FilterRelatedDataRows.run(gridID, val))

    this.cd.detectChanges()

  }

  public removeRow(event: IGridRecordSelectedEvent) {
    if (event.originatedFrom === 'RecordRow') return

    DeleteFromArray(this.values, event.rowKey)

    if (!this.values.length) {
      this.updateValue(null)
      this._clearDataSource()
      this.cd.detectChanges()
      return
    }

    this.updateValue(this.values)
    
    this._valueUpdated.next()

  }

  public get hasSelectedRows(): boolean {
      return typeof this.dataSource !== 'undefined' && this.values?.length > 0
  }

  public get height(): number {
    return Math.min(((this.values.length * 100) + 25), 429)
  }

  private _clearDataSource(): void {
    this.values = []
    this.dataSource?.clearData()
  }

  private get _relatedGridID() {
    return this.cell.type.list?.relatedGridID
  }

}

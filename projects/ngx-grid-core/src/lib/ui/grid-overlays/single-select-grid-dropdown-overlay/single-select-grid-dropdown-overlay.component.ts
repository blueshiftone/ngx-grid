import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent } from 'rxjs'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridDataSource, IGridOverlayData, IGridSelectionSlice } from '../../../typings/interfaces'
import { DataGridComponent } from '../../data-grid/data-grid.component'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'app-single-select-dropdown-overlay',
  templateUrl: './single-select-grid-dropdown-overlay.component.html',
  styleUrls: ['./single-select-grid-dropdown-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSelectGridDropdownOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) public searchInput!: ElementRef<HTMLInputElement>
  @ViewChild('grid') public gridComponent?: DataGridComponent

  public dataSource?: IGridDataSource
  public searchCtrl = new FormControl()
  public override value: Array<string | number> = []

  public gridConfig = new DataGridConfigs().withRowSingleSelect()

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override readonly cd: ChangeDetectorRef
  ) { super(data, cd) }

  override ngOnInit(): void {
    const list = this.data.currentCell.type.list
    this.value = [ this.data.currentCell.value ].filter(v => v !== null && typeof v !== 'undefined')
    if (!list) return
    this.dataSource = this._getDataSource()
    window.requestAnimationFrame(_ => this._searchEl.focus())
    this.addSubscription(fromEvent<KeyboardEvent>(this._searchEl, 'keydown').subscribe(e => {
      if (!this.gridComponent) return
      switch(e.key.toLowerCase()) {
        case 'arrowdown': this.gridComponent.keyboard.arrowDown(); this._stopEvent(e); break
        case 'arrowup'  : this.gridComponent.keyboard.arrowUp(); this._stopEvent(e); break
        case 'enter'    : this.gridComponent.keyboard.enter(); this._stopEvent(e); break
      }
    }))
  }

  public rowSelected(change: IGridSelectionSlice | null) {
    if (!change) {
      this._updateValue(null)
      return
    }
    if (!this.dataSource || !change.rows.length) return
    const pkIndex = this.dataSource.columns.findIndex(c => c.columnKey === this.dataSource!.primaryColumnKey)
    if (change.rows[0][pkIndex] !== this.value[0]) this._updateValue(change.rows[0][pkIndex])
  }

  public openSimpleSelector(): void {
    this.close()
    this.overlayService.open(
      this.cell,
      EGridOverlayType.SingleSelectSimpleForeignKeyDropdownOverlay,
      { size: { height: 300 } }
    )
  }

  public checkGridSize(): void {
    this.gridComponent?.gridController.grid.CheckViewportSize.run()
  }

  private _updateValue(v: any): void {
    this.data.currentCell?.setValue(v)
    this.close()
  }

  private _stopEvent(e: Event) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  private get _searchEl(): HTMLInputElement { return this.searchInput.nativeElement }

  private _getDataSource(): IGridDataSource | undefined {
    const gridID = this.data.currentCell?.type.list?.relatedGridID
    if (!gridID) return undefined
    return this.gridController.grid.GetRelatedData.run(gridID)
  }

}

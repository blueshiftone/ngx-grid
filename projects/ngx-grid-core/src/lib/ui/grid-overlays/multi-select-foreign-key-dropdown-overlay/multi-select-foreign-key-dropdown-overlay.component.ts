import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { distinctUntilChanged, filter, map, pairwise, startWith } from 'rxjs/operators'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GridDataSource } from '../../../grid-data-source'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EForeignKeyDropdownState } from '../../../typings/enums'
import { IGridDataSource, IGridOverlayData, IGridRecordSelectedEvent, IGridRow } from '../../../typings/interfaces'
import { TPrimaryKey } from '../../../typings/types'
import { WithoutValues } from '../../../utils/without-values'
import { RecordSelectorComponent } from '../../record-selector/record-selector.component'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'data-grid-multi-select-foreign-key-dropdown-overlay',
  templateUrl: './multi-select-foreign-key-dropdown-overlay.component.html',
  styleUrls: ['./multi-select-foreign-key-dropdown-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectForeignKeyDropdownOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild('searchInput', { static: true }) public searchInput!: ElementRef<HTMLInputElement>
  @ViewChild('selector') public selectorComponent?: RecordSelectorComponent

  public dataSource?: IGridDataSource
  public values     : TPrimaryKey[] = []
  public searchCtrl                 = new FormControl()

  public gridConfig = new DataGridConfigs().withRowMultiSelect().withConfigs({ scrollToPreselected: false })

  public loadingState = this.gridController.gridEvents
    .ForeignKeyDropdownStateChangedEvent
    .on()
    .pipe(
      filter(event => event.coordinates.equals(this.cell.coordinates)),
      map(event => event.state),
      startWith(EForeignKeyDropdownState.Idle),
      distinctUntilChanged())

  public LoadingState = EForeignKeyDropdownState

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    const list = this.data.currentCell?.type.list
    if (!list) return
    
    const primaryKeyValues = this.data.currentCell.value
    this.values = primaryKeyValues ?? []

    this.addSubscription(this.cell.valueChanged.pipe(startWith(this.cell.value), map(_ => this.cell.value), pairwise()).subscribe(change => {
      this.values = change[1] || []
      if (typeof this.selectorComponent !== 'undefined') {
        const removed = WithoutValues<TPrimaryKey>(change[0], change[1]).map(pk => this._getRow(pk))
        const added   = WithoutValues<TPrimaryKey>(change[1], change[0])
        const controller = this.selectorComponent.gridController
        for (const pk of added) controller.row.RemoveRow.buffer(pk)
        const gridID = this._relatedGridID
        if (gridID && removed.length) {
          const grid = this.gridController.grid.GetRelatedData.run(gridID)
          if (grid) {
            const rows = grid.rows.filter(r => !this.values.includes(r.getValue(grid.primaryColumnKey)?.value))
            for (const row of removed) {
              if (!row) continue
              const index = rows.findIndex(r => r.getValue(grid.primaryColumnKey) === row.getValue(grid.primaryColumnKey))
              controller.row.AddRow.buffer(row, index)
            }
          }
        }
      }
      this.cd.detectChanges()
    }))

    this.addSubscription(this.loadingState.subscribe(dropdownState => {
      if (dropdownState == EForeignKeyDropdownState.Idle) {
        this.dataSource = this._getDataSource()
        window.requestAnimationFrame(_ => {
          this._searchEl.focus()
          window.requestAnimationFrame(_ => {
            if (this.selectorComponent) { 
              for (const pk of this.values) {
                this.selectorComponent.gridController.row.RemoveRow.buffer(pk)
              }
            }
          })
        })
      }
    }))

  }

  public checkGridSize(): void {
    this.selectorComponent?.viewportComponent?.checkViewportSize()
  }

  public rowSelected(event: IGridRecordSelectedEvent) {
    if (this.values.includes(event.rowKey)) return
    const nextValues = [...this.values]
    nextValues.push(event.rowKey)
    this.updateValue(nextValues)
    if (event.originatedFrom === 'RecordRow') this.close()
  }

  private get _searchEl(): HTMLInputElement { return this.searchInput.nativeElement }

  private _getDataSource(): IGridDataSource {
    const gridID = this._relatedGridID
    if (!gridID) return new GridDataSource()
    const grid = this.gridController.grid.GetRelatedData.run(gridID)
    return grid ? GridDataSource.cloneSource(grid) : new GridDataSource()
  }

  private _getRow(pk: TPrimaryKey): IGridRow | undefined {
    return this.gridController.grid.GetRelatedGridRow.run(this._relatedGridID, pk)
  }

  private get _relatedGridID() {
    return this.data.currentCell?.type.list?.relatedGridID
  }

}

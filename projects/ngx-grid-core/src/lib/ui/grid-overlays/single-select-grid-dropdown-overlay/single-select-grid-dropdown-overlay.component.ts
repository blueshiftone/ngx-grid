import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent, map } from 'rxjs'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GridDataSource } from '../../../grid-data-source'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { LocalizationService } from '../../../services/localization.service'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridDataSource, IGridOverlayData, IGridSelectionSlice } from '../../../typings/interfaces'
import { DataGridComponent } from '../../data-grid/data-grid.component'
import { BaseOverlayComponent } from '../base-grid-overlay.component'
import {debounceTime, distinctUntilChanged, filter, startWith} from "rxjs/operators";
import {EForeignKeyDropdownState} from "../../../typings/enums";

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

  public locBackToSimpleSelector = this.loc.getLocalizationStringObservable('locBackToSimpleSelector')

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override readonly cd: ChangeDetectorRef,
    private loc: LocalizationService
  ) { super(data, cd) }

  override ngOnInit(): void {
    const list = this.data.currentCell.type.list
    this.value = [ this.data.currentCell.value ].filter(v => v !== null && typeof v !== 'undefined')
    if (!list) return
    this._getDataSource().then(d => {
      this.dataSource = d
      this.cd.detectChanges()
    })
    window.requestAnimationFrame(_ => this._searchEl.focus())
    this.addSubscription(fromEvent<KeyboardEvent>(this._searchEl, 'keydown').subscribe(e => {
      if (!this.gridComponent) return
      switch(e.key.toLowerCase()) {
        case 'arrowdown': this.gridComponent.keyboard.arrowDown(); this._stopEvent(e); break
        case 'arrowup'  : this.gridComponent.keyboard.arrowUp(); this._stopEvent(e); break
        case 'enter'    : this.gridComponent.keyboard.enter(); this._stopEvent(e); break
      }
    }))
    this.addSubscription(this.searchCtrl.valueChanges.pipe(debounceTime(500)).subscribe(searchString => {
      if (!this.dataSource) return
      if (!this.dataSource.moreDataExists) return
      this.gridController.gridEvents.SearchDropdownOptionsEvent.emit({ searchString, coordinates: this.data.currentCell.coordinates})
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

  public dropdownState = this.gridController.gridEvents
    .ForeignKeyDropdownStateChangedEvent
    .on()
    .pipe(
      filter(event => event.coordinates.equals(this.cell.coordinates)),
      map(event => event.state),
      startWith(EForeignKeyDropdownState.Idle),
      distinctUntilChanged())

  public openSimpleSelector(): void {
    this.close()
    this.overlayService.open(
      this.cell,
      EGridOverlayType.SingleSelectSimpleForeignKeyDropdownOverlay,
      { size: { height: 300 } },
      this.cellViewContainerRef
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

  private async _getDataSource(): Promise<IGridDataSource | undefined> {
    const gridID = this.data.currentCell?.type.list?.relatedGridID
    if (!gridID) return undefined
    let originalSource = this.gridController.grid.GetRelatedData.run(gridID)
    if (originalSource) {
      // clone the source to avoid changing the original
      const clonedSource = await GridDataSource.cloneSource(originalSource)

      // Sync updates into this data source
      this.addSubscription(originalSource.onChanges.subscribe(() => {
        const rows = originalSource.rows.head?.value ?? [];
        clonedSource.upsertRows(rows);
        clonedSource.rows.head?.touch();
      }))

      return clonedSource
    }
    return originalSource
  }

  protected readonly ForeignKeyDropdownState = EForeignKeyDropdownState;
}

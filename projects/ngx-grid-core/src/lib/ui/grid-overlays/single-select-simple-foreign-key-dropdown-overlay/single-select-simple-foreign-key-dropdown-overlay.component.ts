import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent, Subject } from 'rxjs'
import { startWith } from 'rxjs/operators'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridDataSource, IGridOverlayData, IGridSelectListOption } from '../../../typings/interfaces'
import { DataGridComponent } from '../../data-grid/data-grid.component'
import { BaseOverlayComponent } from '../base-grid-overlay.component'
import { EGridOverlayTypes } from '../grid-overlay-types'

@Component({
  selector: 'data-grid-single-select-simple-foreign-key-dropdown-overlay',
  templateUrl: './single-select-simple-foreign-key-dropdown-overlay.component.html',
  styleUrls: ['./single-select-simple-foreign-key-dropdown-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSelectSimpleForeignKeyDropdownOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild    ('wrapper', { static: true }) public wrapperElement!   : ElementRef<HTMLDivElement>
  @ViewChild    ('searchInput', { static: true }) public searchInput!  : ElementRef<HTMLInputElement>
  @ViewChild    ('grid') public gridComponent?                         : DataGridComponent
  @ViewChildren('options', { read: ElementRef }) public optionElements?: QueryList<ElementRef>

  public dataSource?    : IGridDataSource
  public searchCtrl                               = new FormControl()
  public override value: Array<string | number>   = []
  public filteredOptions: IGridSelectListOption[] = []

  public scrollOffset = 0

  public highlightedItem?: IGridSelectListOption | null
  public highlightedElement = new Subject<HTMLElement>()

  private _options: IGridSelectListOption[] = []

  public gridConfig = new DataGridConfigs().withRowSingleSelect()

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    const list = this.data.currentCell?.type.list
    this.value = [ this.data.currentCell?.value ].filter(v => v !== null && typeof v !== 'undefined')
    if (!list) return
    this.dataSource = this._getDataSource()
    if (!this.dataSource) return

    this.dataSource.rows.forEach(row => {
      const primaryKey = row.rowKey
      const option: IGridSelectListOption = {
        value: primaryKey,
        label: this.gridController.grid.GetRelatedDataPreviewString.run(this.dataSource?.dataGridID ?? '', primaryKey)?.toString() ?? primaryKey
      }
      this._options.push(option)
    })
    this.filteredOptions = [...this._options]
    window.requestAnimationFrame(_ => {
      this._searchEl.focus()
      this._highlightSelected()
    })
    this.addSubscription(fromEvent<KeyboardEvent>(this.wrapperElement.nativeElement, 'keydown').subscribe(e => {
      switch(e.key.toLowerCase()) {
        case 'arrowdown': this.highlightNext(1); this._stopEvent(e); break
        case 'arrowup'  : this.highlightNext(-1); this._stopEvent(e); break
        case 'enter'    : 
          if (typeof this.highlightedItem !== 'undefined') this.selectOption(this.highlightedItem ?? null)
          this._stopEvent(e);
        break
        case 'escape'   : this._stopEvent(e); this.close(); break
      }
    }))
    this.addSubscription(this.searchCtrl.valueChanges.subscribe(_ => this._filterOptions()))
    this.addSubscription(fromEvent(this.wrapperElement.nativeElement, 'scroll').subscribe(_ => {
      this.scrollOffset = this.wrapperElement.nativeElement.scrollTop
      this.cd.detectChanges()
    }))
    this.addSubscription(this.cell.valueChanged.pipe(startWith()).subscribe(_ => this._highlightSelected()))

    const keyboardEventPassedThrough = this.gridController.gridEvents.KeyPressPassedThroughEvent.state
    if (keyboardEventPassedThrough && keyboardEventPassedThrough.valueOfKey) {
      this.searchCtrl.setValue(keyboardEventPassedThrough.valueOfKey)
      this.gridController.gridEvents.KeyPressPassedThroughEvent.emit(null)
    }

  }

  public highlightNext(increment: number): void {
    let currentIndex = -2
    if (typeof this.highlightedItem !== 'undefined') {
      currentIndex = this.highlightedItem ? this.filteredOptions.indexOf(this.highlightedItem) : -1
    }
    const index = Math.max(-1, Math.min(currentIndex + increment, this.filteredOptions.length - 1))
    this.highlightedItem = this.filteredOptions[index] ?? null
    if (index > -1) {
      const el = this.optionElements?.get(index)
      if (el) this.highlightedElement.next(el.nativeElement)
    } else {
      const el = this.wrapperElement.nativeElement.firstElementChild
      if (el) this.highlightedElement.next(el as HTMLElement)
    }
    this.cd.detectChanges()
  }

  public openGrid(): void {
    this.close()
    this.overlayService.open(
      this.cell,
      EGridOverlayTypes.SingleSelectGridDropdownOverlay,
      {size: {
        width: 550,
        height: 300
      }}
    )
  }

  public selectOption(op: IGridSelectListOption | null): void {
    this._updateValue(op?.value ?? null)
  }

  private _highlightSelected(): void {
    const currentIndex = this.filteredOptions.findIndex(op => op.value === this.cell.value)
    if (currentIndex > -1) {
      const el = this.optionElements?.get(currentIndex)
      if (typeof el !== 'undefined') {
        this.highlightedItem = this.filteredOptions[currentIndex]
        this.highlightedElement.next(el.nativeElement)
        this.cd.detectChanges()
      }
    }
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

  private _filterOptions(): void {
    const searchFilter = this.searchCtrl.value?.toLowerCase()
    if (!searchFilter) this.filteredOptions = [...this._options]
    else this.filteredOptions = this._options.filter(o =>
      {
        return (o.label || '').toString().toLowerCase().includes(searchFilter) ||
        o.value.toString().toLowerCase().includes(searchFilter)
      }
    )
  }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

}

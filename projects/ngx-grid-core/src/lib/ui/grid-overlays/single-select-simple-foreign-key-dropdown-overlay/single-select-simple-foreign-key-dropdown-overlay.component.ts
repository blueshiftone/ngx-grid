import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { BehaviorSubject, fromEvent, Observable } from 'rxjs'
import { distinctUntilChanged, filter, map, startWith, take } from 'rxjs/operators'

import { DataGridConfigs } from '../../../data-grid-configs.class'
import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EForeignKeyDropdownState } from '../../../typings/enums'
import { EGridOverlayType } from '../../../typings/enums/grid-overlay-type.enum'
import { IGridDataSource, IGridOverlayData, IGridSelectListOption } from '../../../typings/interfaces'
import { HasParentMatching } from '../../../utils/find-parent-element-of-class'
import { DataGridComponent } from '../../data-grid/data-grid.component'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'data-grid-single-select-simple-foreign-key-dropdown-overlay',
  templateUrl: './single-select-simple-foreign-key-dropdown-overlay.component.html',
  styleUrls: ['./single-select-simple-foreign-key-dropdown-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSelectSimpleForeignKeyDropdownOverlayComponent extends BaseOverlayComponent implements OnInit {

  public  itemHeight     = 30
  private _scrollPadding = 10

  @ViewChild('wrapper', { static: true }) public wrapperElement!: ElementRef<HTMLDivElement>
  @ViewChild('searchInput', { static: true }) public searchInput!: ElementRef<HTMLInputElement>
  @ViewChild('grid') public gridComponent?: DataGridComponent
  @ViewChild('virtualScrollViewport', { read: CdkVirtualScrollViewport }) public virtualScrollViewport?: CdkVirtualScrollViewport

  public dataSource?: IGridDataSource

  public searchCtrl        = new FormControl()
  public scrollOffsetAsync = this.virtualScrollViewport?.scrolledIndexChange ?? new Observable()
  public gridConfig        = new DataGridConfigs().withRowSingleSelect()
  public selectedOption    = new BehaviorSubject<IGridSelectListOption | null>(null)

  public override value: Array<string | number>   = []
  public filteredOptions: IGridSelectListOption[] = []

  private _options: IGridSelectListOption[] = []

  public dropdownState = this.gridController.gridEvents
    .ForeignKeyDropdownStateChangedEvent
    .on()
    .pipe(
      filter(event => event.coordinates.equals(this.cell.coordinates)),
      map(event => event.state),
      startWith(EForeignKeyDropdownState.Idle),
      distinctUntilChanged())

  public ForeignKeyDropdownState = EForeignKeyDropdownState

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    @Inject(DOCUMENT) public doc: Document,
    public override cd: ChangeDetectorRef
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    const list = this.data.currentCell?.type.list
    this.value = [this.data.currentCell?.value].filter(v => v !== null && typeof v !== 'undefined')

    if (list === undefined) throw new Error(`Cell does not appear to be a dropdown type. It is missing the list property.`)

    this.addSubscription(fromEvent<KeyboardEvent>(this.wrapperElement.nativeElement, 'keydown').subscribe(e => {
      switch (e.key.toLowerCase()) {
        case 'arrowdown': this.highlightNext(1); this._stopEvent(e); break
        case 'arrowup': this.highlightNext(-1); this._stopEvent(e); break
        case 'enter':
          this.selectOption(this.selectedOption.value)
          this._stopEvent(e)
          break
        case 'escape': this._stopEvent(e); this.close(); break
      }
    }))

    this.addSubscription(this.searchCtrl.valueChanges.subscribe(_ => this._filterOptions()))
    this.addSubscription(this.cell.valueChanged.pipe(startWith()).subscribe(_ => this._highlightSelected()))

    const keyboardEventPassedThrough = this.gridController.gridEvents.KeyPressPassedThroughEvent.state
    if (keyboardEventPassedThrough && keyboardEventPassedThrough.valueOfKey) {
      this.searchCtrl.setValue(keyboardEventPassedThrough.valueOfKey)
      this.gridController.gridEvents.KeyPressPassedThroughEvent.emit(null)
    }

    this.dataSource = this._getDataSource()
    if (this.dataSource !== undefined) {
      this._initDatasource(this.dataSource)
    } else {
      this.addSubscription(this.gridController.gridEvents.RelatedGridAddedEvent.on().pipe(filter(e => e.dataGridID === this.gridId), take(1)).subscribe(dataSource => {
        this.dataSource = dataSource
        this._initDatasource(dataSource)
      }))
    }

    window.setTimeout(() => {
      this.addSubscription(fromEvent<MouseEvent>(this.doc.documentElement, 'click').subscribe(e => {
        const focusedCellElement = this.gridController.cell.CellComponents.findWithCoords(this.gridController.gridEvents.CellFocusChangedEvent.state)?.element
        const targetEl = e.target as HTMLElement
        if (
          !HasParentMatching(this.data.overlayRef.overlayElement, targetEl)
          && (!focusedCellElement || !HasParentMatching(focusedCellElement, targetEl))
        ) {
          this.data.overlayRef.dispose()
        }
      }))
    })
  }

  private _initDatasource(dataSource: IGridDataSource) {
    this._setOptions()
    this.addSubscription(dataSource.onChanges.subscribe(_ => this._setOptions()))
  }

  private _setOptions(): void {
    if (!this.dataSource) return

    this._options = this.dataSource.rows.map(r => ({
      value: r.rowKey,
      label: this.gridController.grid.GetRelatedDataPreviewString.run(this.dataSource?.dataGridID ?? '', r.rowKey)
    }))

    this._filterOptions()

    window.requestAnimationFrame(_ => {
      this._searchEl.focus()
      this._highlightSelected()
    })

    this.cd.detectChanges()
  }

  public highlightNext(increment: number): void {
    const selectedOption = this.selectedOption.value
    let index = (selectedOption !== null ? this.filteredOptions.indexOf(selectedOption) + increment : 0)
    if (index < 0) index = this.filteredOptions.length - 1
    const nextOption = this.filteredOptions[index] ?? this.filteredOptions[0]
    this.selectedOption.next(nextOption)
    this._scrollIndexIntoView(index, increment > 0 ? 'down' : 'up')
  }

  private _scrollIndexIntoView(index: number, direction: 'up' | 'down') {
    
    const viewportSize = (this.virtualScrollViewport?.getViewportSize() ?? 0) 

    const viewportElement = this.virtualScrollViewport?.elementRef.nativeElement

    if (viewportElement) {
      window.requestAnimationFrame(_ => {
        
        const highlightedElement = viewportElement.getElementsByClassName('highlighted')[0] as HTMLElement | undefined

        if (highlightedElement !== undefined) {

          const highlightedElementOffsetTop = index * this.itemHeight

          if (
            (viewportElement.scrollTop + viewportSize < highlightedElementOffsetTop + this.itemHeight) ||
            (viewportElement.scrollTop > highlightedElementOffsetTop)
          ) {

            if (direction === 'down') {
              viewportElement?.scrollTo({ top: (highlightedElementOffsetTop + this.itemHeight + this._scrollPadding) - viewportSize })
            } else {
              viewportElement?.scrollTo({ top: highlightedElementOffsetTop - this._scrollPadding })
            }
          }
          
        } else {
          this.virtualScrollViewport?.scrollToIndex(index)
        }
      })
    }
  }

  public openGrid(): void {
    this.close()
    this.overlayService.open(
      this.cell,
      EGridOverlayType.SingleSelectGridDropdownOverlay,
      {
        size: {
          width: 550,
          height: 300
        }
      }
    )
  }

  public selectOption(op: IGridSelectListOption | null): void {
    this._updateValue(op?.value ?? null)
  }

  private _highlightSelected(): void {
    const currentIndex = this.filteredOptions.findIndex(op => op.value === this.cell.value)
    if (currentIndex > -1) {
      const selectedOption = this.filteredOptions[currentIndex]
      if (selectedOption.value !== null) {
        this.selectedOption.next(this.filteredOptions[currentIndex])
      }
      this._scrollIndexIntoView(currentIndex, 'down')
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
    if (this.gridId === undefined) return undefined
    return this.gridController.grid.GetRelatedData.run(this.gridId)
  }

  private _filterOptions(): void {
    const searchFilter = this.searchCtrl.value?.toLowerCase()
    if (!searchFilter) this.filteredOptions = [...this._options]
    else this.filteredOptions = this._options.filter(o => {
      return (o.label || '').toString().toLowerCase().includes(searchFilter) ||
        (o.value ?? '').toString().toLowerCase().includes(searchFilter)
    }
    )
    this.filteredOptions.unshift({ value: null, label: ' ' })
  }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

  public get gridId() {
    return this.data.currentCell?.type.list?.relatedGridID
  }

}

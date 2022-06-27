import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { FormControl } from '@angular/forms'
import { fromEvent, Subject } from 'rxjs'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridOverlayData, IGridSelectListOption } from '../../../typings/interfaces'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'app-static-dropdown-overlay',
  templateUrl: './static-dropdown-overlay.component.html',
  styleUrls: ['./static-dropdown-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaticDropdownOverlayComponent extends BaseOverlayComponent implements OnInit {

  @ViewChild   ('searchInput', { static: true }) public searchInput!   : ElementRef<HTMLInputElement>
  @ViewChild   ('wrapper',     { static: true }) public wrapperElement!: ElementRef<HTMLDivElement>
  @ViewChildren('options', { read: ElementRef }) public optionElements?: QueryList<ElementRef>

  public filteredOptions: IGridSelectListOption[] = []
  public searchCtrl = new FormControl()

  public scrollOffset = 0

  public highlightedItem?: IGridSelectListOption | null
  public highlightedElement = new Subject<HTMLElement>()

  private _options: IGridSelectListOption[] = []

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public  override cd                            : ChangeDetectorRef,
  ) {
    super(data, cd)
  }

  override ngOnInit(): void {
    const list = this.data.currentCell?.type.list
    if (!list) return
    this._options = list.staticOptions ?? []
    if (this.isMultiSelect) {
      const alreadySelected = this.cell.value ?? []
      this._options = this._options.filter(op => !alreadySelected.includes(op.value))
    }
    this.filteredOptions = [...this._options]
    window.requestAnimationFrame(_ => this._searchEl.focus())
    this.addSubscription(fromEvent<KeyboardEvent>(this.wrapperElement.nativeElement, 'keydown').subscribe(e => {
      switch(e.key.toLowerCase()) {
        case 'arrowdown': this.highlightNext(1); this._stopEvent(e); break // Todo
        case 'arrowup'  : this.highlightNext(-1); this._stopEvent(e); break // Todo
        case 'enter'    : 
          if (typeof this.highlightedItem !== 'undefined') this.selectOption(this.highlightedItem ?? null)
          this._stopEvent(e);
        break // Todo
        case 'escape'   : this._stopEvent(e); this.close(); break
      }
    }))
    this.addSubscription(this.searchCtrl.valueChanges.subscribe(_ => this._filterOptions()))
    this.addSubscription(fromEvent(this.wrapperElement.nativeElement, 'scroll').subscribe(_ => {
      this.scrollOffset = this.wrapperElement.nativeElement.scrollTop
      this.cd.detectChanges()
    }))

    const keyboardEventPassedThrough = this.gridController.gridEvents.KeyPressPassedThroughEvent.state
    if (keyboardEventPassedThrough && keyboardEventPassedThrough.valueOfKey) {
      this.searchCtrl.setValue(keyboardEventPassedThrough.valueOfKey)
      this.gridController.gridEvents.KeyPressPassedThroughEvent.emit(null)
    }
  }

  public highlightNext(increment: number): void {
    const hasBlankValue = !this.isMultiSelect && !this.searchCtrl.value
    let currentIndex = hasBlankValue ? -2 : -1
    if (typeof this.highlightedItem !== 'undefined') {
      currentIndex = this.highlightedItem ? this.filteredOptions.indexOf(this.highlightedItem) : hasBlankValue ? -1 : 0
    }
    const index = Math.max(hasBlankValue ? -1 : 0, Math.min(currentIndex + increment, this.filteredOptions.length - 1))
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

  public selectOption(op: IGridSelectListOption | null): void {
    this._updateValue(op?.value ?? null)
  }

  public createOption(): void {
    const list = this.data.currentCell?.type.list
    if (!list || !this.searchCtrl.value.trim()) return
    const value = this.searchCtrl.value
    list.staticOptions?.push({ value: value })
    this._updateValue(value)
  }

  private _updateValue(v: any): void {
    if (v === null) this.updateValue(v)
    if (this.isMultiSelect) {
      this.updateValue([...(this.cell.value ?? []), v])
    } else {
      this.updateValue(v)
    }
    this.close()
  }

  private _filterOptions(): void {
    if (!this.searchCtrl.value) this.filteredOptions = [...this._options]
    else this.filteredOptions = this._options.filter(o =>
      (o.value ?? '').toString().toLowerCase().includes(this.searchCtrl.value.toLowerCase()) ??
      (o.label || '').toString().toLowerCase().includes(this.searchCtrl.value.toLowerCase())
    )
  }

  private _stopEvent(e: Event) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  private get _searchEl(): HTMLInputElement { return this.searchInput.nativeElement }

  public get defaultColor(): string | undefined {
    return this.data.currentCell.type.list?.color
  }

  public get isMultiSelect() {
    return this.data.currentCell.type.name === 'DropdownMultiSelect'
  }

}

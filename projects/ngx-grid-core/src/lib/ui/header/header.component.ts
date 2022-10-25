import { CdkDragSortEvent } from '@angular/cdk/drag-drop'
import { DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { BehaviorSubject, fromEvent, merge, startWith } from 'rxjs'
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { LocalizationService } from '../../services/localization.service'
import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { EColumnIconVisibility, IGridColumn, IGridSeparator } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { CharacterSizer } from '../../utils/character-sizer'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'
import { HasParentOfClass } from '../../utils/find-parent-element-of-class'

@Component({
  selector: 'data-grid-header',
  templateUrl: './header.component.html',
  styleUrls: [
    '../../data-grid-common-styles.scss',
    './header.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent extends AutoUnsubscribe implements OnInit {

  @ViewChildren('columnMenuTrigger') public columnMenuTriggers?: QueryList<MatMenuTrigger>

  @ViewChildren('columnElement', { read: ElementRef }) public columnElements?: QueryList<ElementRef>

  @ViewChild("columnMenuTemplate", { read: ViewContainerRef }) public columnMenuContainerRef?: ViewContainerRef

  public columns = new BehaviorSubject<IGridColumn[]>([])
  public dragDisabled                              = false
  public isDragging                                = new BehaviorSubject<boolean>(false)
  public columnsSelected: {[key: string]: boolean} = {}

  public columnWidths = 
    merge(this._gridEvents.ColumnWidthChangedEvent.onWithInitialValue(), this._gridEvents.ColumnsChangedEvent.on())
      .pipe(map(_ => this._gridEvents.ColumnWidthChangedEvent.state?.columns ?? new Map()))

  public iconVisibility = EColumnIconVisibility

  private _isResizing = false

  constructor(
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>,
    private readonly loc           : LocalizationService,
    @Inject(DOCUMENT)
    private readonly doc: Document,
  ) { super() }

  ngOnInit(): void {

    this.addSubscription(
      this._gridEvents.GridDataChangedEvent.on()
        .pipe(
          startWith(this.gridController.dataSource),
          switchMap(source => source.onChanges.pipe(startWith(null))))
        .subscribe(_ => this.updateColumns()))

    this.addSubscription(this._gridEvents.ColumnSortByChangedEvent.on().subscribe(_ => {
      this.cd.detectChanges()
    }))

    this.addSubscription(
      this._gridEvents.GridScrollOffsetChangedEvent.on().pipe(
        removeNullish(),
        map(offset => offset.fromLeft),
        distinctUntilChanged()
      ).subscribe(leftOffset => this.elRef.nativeElement.style.transform = `translateX(${-leftOffset}px)`)
    )

    this.addSubscription(this._gridEvents.CellSelectionChangedEvent.on().subscribe(selection => {
      const selectedColumnIndexes = [...Array.from(selection?.columns || []), ...Array.from(!selection?.secondarySelection?.isSubtracting ? selection?.secondarySelection?.columns || [] : [])]
      this.columnsSelected = !selection ? {} : selectedColumnIndexes.reduce<{ [key: string]: boolean }>((output, colIndex) => { output[colIndex] = true; return output }, {})
      this.cd.detectChanges()
    }))

    this.addSubscription(this.gridController.dataSource.rows.output.pipe(
      map(rows => rows[0]?.floatingTitle?.isGroup === true),
      distinctUntilChanged()).subscribe(hasGroups => this.elRef.nativeElement.classList.toggle('has-groups', hasGroups)))

    // close column menu when clicking outside of it
    this.addSubscription(fromEvent<MouseEvent>(this.doc, 'mousedown').subscribe(e => {
      const menuIsOpen = (this.columnMenuTriggers ?? []).some(x => x.menuOpen)
      if (
        menuIsOpen &&
        !HasParentOfClass('column-menu', e.target as HTMLElement) &&
        !HasParentOfClass('col-dropdown-btn', e.target as HTMLElement)
      ) {
        for (const t of this.columnMenuTriggers ?? []) {
          if (t.menuOpen) {        
            t.closeMenu()
            this.cd.detectChanges()
            break
          }
        }
      }
    }))
  }

  public startResize = () => this._isResizing  = true
  public endResize   = () => setTimeout(() => this._isResizing = false)
  public sortColumn  = (i: number) => {
    if (this._isResizing) return
    const column = this.columns.value[i]
    const sortOrder = this.currentSortOrder(column)

    // Run the column operation RequestColumnSort 
    // toggle sort direction
    // asc -> desc -> natural
    this.gridController.column.RequestColumnSort.run(column.columnKey, sortOrder === ESortDirection.Asc ? ESortDirection.Desc : sortOrder === ESortDirection.Desc ? ESortDirection.Natural : ESortDirection.Asc)
  }

  public disableDrag = () => this.dragDisabled = true
  public enableDrag  = () => this.dragDisabled = false

  public resizeColumn(distance: number, column: IGridColumn): void {
    const colWidths = this._gridEvents.ColumnWidthChangedEvent.state
    if (!colWidths) return
    colWidths.addDistance(column.columnKey, distance)
    colWidths.changedOne = column.columnKey
    this._gridEvents.ColumnWidthChangedEvent.emit(colWidths)
  }

  public changeColumnOrder(e: CdkDragSortEvent): void {
    this.gridController.column.ChangeColumnOrder.run([e.previousIndex, e.currentIndex])
  }

  public dragStarted = () => {
    this._setCursor('move');
    this.isDragging.next(true);
    this.cd.detectChanges()
  }
  
  public dragStopped = () => {
    this._setCursor('');
    this.isDragging.next(false);
    this.updateColumns()
  }

  public updateColumns(): void {
    if (this.isDragging.value) return
    const nextColumns = [...this.gridController.dataSource.columns]
    const currentColumns = this.columns.value
    if (
      nextColumns.length !== currentColumns.length || 
      nextColumns.some((col, i) => col !== currentColumns[i])
    ) {
      this.columns.next(nextColumns)
    }

    let additionalWidth = 20
    this.columns.value.forEach(v => {
      if (this.currentSortOrder(v) !== ESortDirection.Natural) {
        additionalWidth += 15
      }
      const formattedValue = this.loc.getLocalizedString(v.name ?? v.columnKey)
      this.gridController.column.InitialiseColumnWidth.bufferHeaderCellWidth([v.columnKey, CharacterSizer.measure(formattedValue, this._getFont()) + additionalWidth])
    })
  }

  public openMenu(c: IGridColumn) {
    if (!this.columnMenuContainerRef || !c.dropdownMenu) return
    this.columnMenuContainerRef.clear()
    const ref = this.columnMenuContainerRef.createComponent(c.dropdownMenu?.component)
    ref.instance.column = c
  }

  public isThinlineIcon(iconKey: string | null): boolean {
    if (!iconKey) return false
    return iconKey.startsWith('Thinline')
  }

  private currentSortOrder(column: IGridColumn) {
    return this._gridEvents.ColumnSortByChangedEvent.state?.get(column.columnKey)?.direction ?? ESortDirection.Natural
  }

  public columnHasSort(column: IGridColumn) {
    // return true if the column has a sort order
    return this.currentSortOrder(column) !== ESortDirection.Natural
  }

  public columnSortIconKey(column: IGridColumn) {
    // return the sort icon key for the column (north or south)
    return this.currentSortOrder(column) === ESortDirection.Asc ? 'north' : 'south'
  }

  public separators(columnName: string): IGridSeparator[] {
    return this.gridController.column.GetColumnSeparators.run(columnName)
  }

  private _setCursor(cursor: string): void {
    this.doc.documentElement.style.cursor = cursor
  }
  
  private get _gridEvents() { return this.events.factory }

  private _fontStrCache = ''
  private _getFont(): string {
    if (this._fontStrCache) return this._fontStrCache
    const style = window.getComputedStyle(this.elRef.nativeElement)
    return this._fontStrCache = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  }

}

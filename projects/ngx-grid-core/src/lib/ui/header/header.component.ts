import { CdkDragSortEvent } from '@angular/cdk/drag-drop'
import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core'
import { BehaviorSubject, merge } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { IGridColumn, IGridSeparator } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'

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

  @ViewChildren('columnElement', { read: ElementRef }) public columnElements?: QueryList<ElementRef>

  public columns = new BehaviorSubject<IGridColumn[]>([])
  public dragDisabled                              = false
  public isDragging                                = new BehaviorSubject<boolean>(false)
  public columnsSelected: {[key: string]: boolean} = {}
  public columnWidths = new BehaviorSubject<{[key: string]: number}>({})

  private _isResizing = false

  constructor(
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>,
    @Inject(DOCUMENT)
    private readonly doc: Document,
  ) { super() }

  ngOnInit(): void {
        
    this.addSubscription(
      merge(
        this._gridEvents.GridDataChangedEvent.onWithInitialValue(),
        this._gridEvents.ColumnsChangedEvent.on(),
      )
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

    this.addSubscription(
      merge(this._gridEvents.ColumnWidthChangedEvent.on(), this._gridEvents.ColumnsChangedEvent.on())
      .pipe(map(_ => this._gridEvents.ColumnWidthChangedEvent.state))
      .subscribe(colWidths => {
        colWidths?.columns.forEach(item => this.columnWidths.value[item.columnKey] = item.width)
        this.columnWidths.next(this.columnWidths.value)
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
    this.columns.next([...this.gridController.dataSource.columns])
    if (this.columns.value.length && !this.gridController.isInitialised) {
      window.requestAnimationFrame(_ => {
        this.columnElements?.forEach((el, idx) => {
          this.gridController.column.InitialiseColumnWidth.values.next({ columnKey: this.columns.value[idx].columnKey, width: el.nativeElement.getBoundingClientRect().width })
        })
      })
    }
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

}

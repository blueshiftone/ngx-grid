import { CdkDragSortEvent } from '@angular/cdk/drag-drop'
import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core'
import { distinctUntilChanged, map } from 'rxjs/operators'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { ESortDirection } from '../../typings/enums/sort-direction.enum'
import { IGridSeparator } from '../../typings/interfaces'
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

  @ViewChildren('columns', { read: ElementRef }) public columnElements?: QueryList<ElementRef>

  public columns: string[]                         = []
  public dragDisabled                              = false
  public sortingBy: string | null                  = null
  public sortingByDirection: ESortDirection        = ESortDirection.Natural
  public isDragging                                = false
  public columnsSelected: {[key: string]: boolean} = {}

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
        
    this.addSubscription(this._gridEvents.GridDataChangedEvent.onWithInitialValue().subscribe(_ => this.setValues()))

    this.addSubscription(this._gridEvents.ColumnSortByChangedEvent.on().subscribe(_ => {
      const sortBy = this._gridEvents.ColumnSortByChangedEvent.state
      this.sortingBy          = sortBy ? sortBy.columnName : null
      this.sortingByDirection = sortBy ? sortBy.sortOrder : ESortDirection.Natural
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

    this.addSubscription(this._gridEvents.ColumnWidthChangedEvent.on().subscribe(colWidths => {
      colWidths.columns.forEach(col => {
        const el = this.columnElements?.get(this.columns.indexOf(col.columnKey))
        if (el) el.nativeElement.style.width = `${col.width}px`;
      })
    }))

  }

  public startResize = () => this._isResizing  = true
  public endResize   = () => setTimeout(() => this._isResizing = false)
  public sortColumn  = (i: number) => !this._isResizing && this.gridController.column.SortColumn.run(this.columns[i])
  public disableDrag = () => this.dragDisabled = true
  public enableDrag  = () => this.dragDisabled = false

  public resizeColumn(distance: number, columnKey: string): void {
    const colWidths = this._gridEvents.ColumnWidthChangedEvent.state
    if (!colWidths) return
    colWidths.addDistance(columnKey, distance)
    colWidths.changedOne = columnKey
    this._gridEvents.ColumnWidthChangedEvent.emit(colWidths)
  }

  public changeColumnOrder(e: CdkDragSortEvent): void {
    this.gridController.column.ChangeColumnOrder.run([e.previousIndex, e.currentIndex])
  }

  public dragStarted = () => {
    this._setCursor('move');
    this.isDragging = true;
    this.cd.detectChanges()
  }
  public dragStopped = () => {
    this._setCursor('');
    this.isDragging = false;
    this.cd.detectChanges()
  }

  public setValues(): void {
    this.columns = this.gridController.column.GetColumns.run()
    if (this.columns.length && !this.gridController.isInitialised) {
      window.requestAnimationFrame(_ => {
        this.columnElements?.forEach((el, idx) => {
          this.gridController.column.InitialiseColumnWidth.values.next({ columnKey: this.columns[idx], width: el.nativeElement.getBoundingClientRect().width })
        })
      })
    }
    this.cd.detectChanges()
  }

  public label(columnKey: string): string {
    return this.gridController.column.GetColumnLabel.run(columnKey)
  }

  public separators(columnName: string): IGridSeparator[] {
    return this.gridController.column.GetColumnSeparators.run(columnName)
  }

  private _setCursor(cursor: string): void {
    this.doc.documentElement.style.cursor = cursor
  }
  
  private get _gridEvents() { return this.events.factory }

}

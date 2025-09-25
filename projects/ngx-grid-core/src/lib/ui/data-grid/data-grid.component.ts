import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  inject,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { fromEvent, merge, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators'

import { GridControllerService } from '../../controller/grid-controller.service'
import SELECTION_STRATEGIES from '../../controller/selection/strategies'
import { DataGridConfigs } from '../../data-grid-configs.class'
import { GridEventsService } from '../../events/grid-events.service'
import { GridContextMenuService } from '../../services/grid-context-menu.service'
import { GridMultiCellEditService } from '../../services/grid-multi-cell-edit.service'
import { GridOverlayService } from '../../services/grid-overlay-service.service'
import { LocalizationService } from '../../services/localization.service'
import { FOCUS_TRACKER, IGridConfiguration, IGridDataSource, IGridSelectionSlice } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'
import { WINDOW } from '../../utils/window'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { ExcelFormatter } from '../../utils/excel-formatter.class'
import { Clipboard } from '../../utils/clipboard.class'
import { MatSnackBar } from '@angular/material/snack-bar'
import { nanoid } from 'nanoid'

@Component({
  selector: 'data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: [
    './data-grid.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    GridControllerService,
    GridEventsService,
    LocalizationService,
    GridOverlayService,
    GridContextMenuService,
    GridMultiCellEditService,
  ],
})
export class DataGridComponent extends AutoUnsubscribe implements OnInit, OnChanges {

  @Input() public name          ?: string
  @Input() public config         : IGridConfiguration = new DataGridConfigs()
  @Input() public data!          : IGridDataSource
  @Input() public preselectedRows: Array<number | string> = []
  @Input() public filterString?  : string
  @Input() public disabled?      : boolean

  @Output() public selectionChanged = new EventEmitter<IGridSelectionSlice | null>()

  public initialised = false

  public keyboard = this.gridController.keyboardTriggers

  public cornerActions = this.events.factory.GridTopLeftCornerActionsChangedEvent.on()

  private _nextFilterString = new Subject<string>()
  private _preselectedRowsChanged = new Subject<void>()
  private _preselectedRowsUpdated = new Subject<void>()

  private themeStyleElement: HTMLStyleElement = document.createElement('style')

  focusTracker = inject(FOCUS_TRACKER)

  @HostListener('mousedown')
  onClick() {
    const id = this.gridController.grid.GetGridId.run()
    if (!this.focusTracker.hasFocus(id)) {
      this.focusTracker.setFocus(id);
    }
  }

  @ViewChild('rowThumb', { static: true }) private rowThumb!: ElementRef<HTMLDivElement>

  private _uniqueId = `_${nanoid()}`
  @HostBinding('id') private get _id() { return this._uniqueId }

  async onRowThumbDblClick() {

    // Copy entire grid + headers to clipboard
    const firstRow = this.gridController.dataSource.rows.latestValue[0]
    const lastRow = this.gridController.dataSource.rows.latestValue[this.gridController.dataSource.rows.latestValue.length - 1]

    const firstColumn = this.gridController.dataSource.columns[0]
    const lastColumn = this.gridController.dataSource.columns[this.gridController.dataSource.columns.length - 1]

    const startPos = new GridCellCoordinates(firstRow.rowKey, firstColumn.columnKey)
    const endPos   = new GridCellCoordinates(lastRow.rowKey, lastColumn.columnKey)

    const selection = this.gridController.selection.CreateSelectionStateFromCoordinates.run([startPos, endPos])
    selection.currentSelection.addRange(startPos, endPos)
    const slice = this.gridController.selection.GetSelectionSlice.run(selection.currentSelection)

    if (slice) {      
      const formatter = new ExcelFormatter(this.gridController, slice)
      const html = formatter.toExcelHTML(true)
      const plain = formatter.toPlainText(true)
      await new Clipboard()
        .setHTML(html)
        .setPlainText(plain)
        .write()
      this._gridEvents.GridDataCopiedEvent.emit(true)

      this.snack.open(
        this.localizations.getLocalizedString("locGridCopiedToClipboard"),
        this.localizations.getLocalizedString("locClose"), { duration: 3000 });
    }
  }

  constructor(
    @Inject(WINDOW) private _window: Window,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>,
    public  readonly gridController: GridControllerService,
    private readonly overlays      : GridOverlayService,
    public  readonly events        : GridEventsService,
    public  readonly localizations : LocalizationService,
    private readonly ctxService    : GridContextMenuService,
    public  readonly multiEdit     : GridMultiCellEditService,
    public  readonly snack         : MatSnackBar
  ) {
    super()
    window.document.head.appendChild(this.themeStyleElement)
  }

  ngOnInit(): void {
    if (typeof this.data === 'undefined') throw new Error('Data is a required @Input()')
    if (!this._parentEl) return
    if (this._parentIsStatic) this._parentEl.style.position = 'relative'

    this.gridController.grid.SetDataSource.run(this.data)

    if (this.data.localizations) this.localizations.setLocalizations(this.data.localizations)
    
    this._afterGridInit(() => {
      this.initialised = true
      this._applyPreselectedRows()
      this.gridController.selection.initialise(SELECTION_STRATEGIES[this.config.selectionStrategy])
      this._gridEvents.GridModeChangedEvent.emit(this.config.gridMode)
      this.gridController.dataSource.maskNewIds = this.config.maskNewIds
      this.cd.detectChanges()
    })
    
    this._preselectedRowsChanged.subscribe(_ => this._afterGridInit(() => this._applyPreselectedRows()))

    this.addSubscription(
      merge(
        fromEvent<MouseEvent>(this._window.document.documentElement, 'keydown'),
        fromEvent<MouseEvent>(this._window.document.documentElement, 'keyup'))
      .pipe(map(e => e.ctrlKey || e.shiftKey || e.metaKey === true), distinctUntilChanged())
      .subscribe(hasKeyModifier => this._el.classList.toggle('ctrl-or-shift-modifier', hasKeyModifier))
    )

    this.addSubscription(this.config.gridTheme.subscribe(theme => {
      const rowHeightPx = Number(theme.rowHeight.replace('px', ''))
      const thumbWidthPx = Number(theme.rowThumbWidth.replace('px', ''))
      this._gridEvents.GridThemeChangedEvent.emit({
        theme,
        rowHeight: rowHeightPx,
        thumbWidth: thumbWidthPx
      })
      const css = [];
      for (let [key, value] of Object.entries(theme)) {
        const cssPropKey = `--ngx-grid-${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`
        if (key === 'contextMenuItemBackgroundColor') {
          // needs to be set at document-root level because the context menu is inserted outside of the grid element
          this._window.document.documentElement.style.setProperty(cssPropKey, value)
        } else {
          css.push(`${cssPropKey}: ${value};`)
        }
      }
      this.themeStyleElement.innerHTML = `#${this._id} { ${css.join('')} }`
    }))

    this.addSubscription(this._windowFocusChanged.pipe(filter(val => val === false)).subscribe(_ => {
      this._el.classList.toggle('ctrl-or-shift-modifier', false)
    }))
    
    this.addSubscription(this._gridEvents.CellsSelectedEvent.on().subscribe(s => {
      this.selectionChanged.emit(s ?? null)
    }))

    if (this.config.gridMode === 'SelectMode') {
      this.addSubscription(this._gridEvents.RowMouseEnteredEvent.on().pipe(removeNullish()).subscribe(row => {         
        this._gridEvents.RowPreselectedEvent.emit(row.rowKey)
      }))
    }

    this.addSubscription(this._nextFilterString.pipe(debounceTime(100), distinctUntilChanged()).subscribe(val => {
      this._gridEvents.GridFilterStringChangedEvent.emit(val)
    }))

    this.addSubscription(this.config.uiTheme.subscribe(theme => {
      this._gridEvents.GridUIThemeChangedEvent.emit(theme)
    }))

    this.addSubscription(this.gridController.dataSource.rows.output.pipe(
      map(rows => rows[0]?.floatingTitle?.isGroup === true),
      distinctUntilChanged()).subscribe(hasGroups => this.rowThumb.nativeElement.classList.toggle('has-groups', hasGroups)))

  }

  override appOnDestroy(): void {
    this.gridController.onDestroy()
    this.overlays.onDestroy()
    this.ctxService.onDestroy()
    this._gridEvents.onDestroy()
    this.multiEdit.onDestroy()
    window.document.head.removeChild(this.themeStyleElement)
    this.focusTracker.dispose(this._id)
  }

  ngOnChanges(changes: SimpleChanges): void {   
    
    if (this._hasChange('preselectedRows', changes)) this._preselectedRowsChanged.next()

    if (this._hasChange('disabled', changes) && typeof this.disabled !== 'undefined') {
      this.data.disabled = this.disabled
    }

    if (typeof changes['filterString']?.currentValue !== 'undefined')
      this._nextFilterString.next(changes['filterString'].currentValue)
  }

  private async _afterGridInit(fn: () => any): Promise<void> {
    await this.gridController.whenInitialised()
    fn()
  }

  private _applyPreselectedRows(): void {
    if (!this.preselectedRows.length) return
    this._preselectedRowsUpdated.next()
    this.gridController.selection.PreselectRows.run(this.preselectedRows)
    this.gridController.selection.EmitNextSelectionSlice.run()
    if (this.config.scrollToPreselected) this.gridController.selection.ScrollIntoView.run()
  }

  private _hasChange(key: string, changes: SimpleChanges) {
    return changes[key] && changes[key].previousValue !== changes[key].currentValue
  }

  private get _el(): HTMLElement { return this.elRef.nativeElement }
  private get _parentEl(): HTMLElement | null { return this._el.parentElement }
  private get _parentIsStatic(): boolean { return this._parentEl && this._window.getComputedStyle(this._parentEl).position === 'static' || false }

  private _windowFocusChanged = merge(fromEvent(this._window, 'focus'), fromEvent(this._window, 'blur')).pipe(
    map(_ => this._window.document.hasFocus()),
    distinctUntilChanged()
  )

  private get _gridEvents() { return this.events.factory }

}


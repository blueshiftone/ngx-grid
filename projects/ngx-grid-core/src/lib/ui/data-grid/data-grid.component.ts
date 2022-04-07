import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
import { IGridConfiguration, IGridDataSource, IGridSelectionSlice } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { removeNullish } from '../../utils/custom-rxjs/remove-nullish'
import { WINDOW } from '../../utils/window'

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

  @Input() public config         : IGridConfiguration = new DataGridConfigs()
  @Input() public data!          : IGridDataSource
  @Input() public preselectedRows: Array<number | string> = []
  @Input() public filterString?  : string
  @Input() public disabled?      : boolean

  @Output() public selectionChanged = new EventEmitter<IGridSelectionSlice | null>()

  public initialised = false

  public keyboard = this.gridController.keyboardTriggers

  private _nextFilterString = new Subject<string>()
  private _preselectedRowsChanged = new Subject<void>()
  private _preselectedRowsUpdated = new Subject<void>()

  constructor(
    @Inject(WINDOW) private _window: Window,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>,
    public  readonly gridController: GridControllerService,
    private readonly overlays      : GridOverlayService,
    public  readonly events        : GridEventsService,
    public  readonly localizations : LocalizationService,
    private readonly ctxService    : GridContextMenuService,
    public  readonly multiEdit     : GridMultiCellEditService
  ) { super() }

  ngOnInit(): void {
    if (typeof this.data === 'undefined') throw new Error('Data is a required @Input()')
    if (!this._parentEl) return
    if (this._parentIsStatic) this._parentEl.style.position = 'relative'

    this.gridController.grid.SetDataSource.run(this.data)
    
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

  }

  override appOnDestroy(): void {
    this.gridController.onDestroy()
    this.overlays.onDestroy()
    this.ctxService.onDestroy()
    this._gridEvents.onDestroy()
    this.multiEdit.onDestroy()
  }

  ngOnChanges(changes: SimpleChanges): void {   
    
    if (this._hasChange('preselectedRows', changes)) this._preselectedRowsChanged.next()

    if (this._hasChange('disabled', changes) && typeof this.disabled !== 'undefined') {
      this.data.disabled = this.disabled
    }

    if (typeof changes['FilterString']?.currentValue !== 'undefined')
      this._nextFilterString.next(changes['FilterString'].currentValue)
  }

  private async _afterGridInit(fn: () => any): Promise<void> {
    await this.gridController.whenInitialised()
    fn()
  }

  private _applyPreselectedRows(): void {
    if (!this.preselectedRows.length) return
    this._preselectedRowsUpdated.next()
    this.gridController.selection.preselectRows(this.preselectedRows)
    this.gridController.selection.emitNextSelectionSlice()
    if (this.config.scrollToPreselected) this.gridController.selection.scrollIntoView()
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


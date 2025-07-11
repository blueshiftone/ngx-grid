import { DatePipe } from '@angular/common'
import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { combineLatest, fromEvent, Subscription } from 'rxjs'
import { filter, startWith, take } from 'rxjs/operators'

import { GridEventsService } from '../events/grid-events.service'
import { GridDataSource } from '../grid-data-source'
import { GridFileUploadService } from '../services/grid-file-upload.service'
import { IconsService } from '../services/icon.service'
import { LocalPreferencesService } from '../services/local-preferences.service'
import { LocalizationService } from '../services/localization.service'
import { ERowStatus } from '../typings/enums'
import { IGridCellComponent, IGridDataSource } from '../typings/interfaces'
import { GridCellCoordinates } from '../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { TPrimaryKey } from '../typings/types'
import { DeleteFromArray } from '../utils/array-delete'
import { HasParentOfClass } from '../utils/find-parent-element-of-class'
import { CellOperationFactory } from './cell-operations/_cell-operation.factory'
import { ColumnOperationFactory } from './column-operations/_column-operation.factory'
import { GridOperationFactory } from './grid-operations/_grid-operation.factory'
import { RowOperationFactory } from './row-operations/_row-operation.factory'
import { GridSelectionController } from './selection/grid-selection.controller'
import { MatIconRegistry } from '@angular/material/icon'

export const DATA_GRIDS_FOCUSED_TREE: string[] = [] 

@Injectable()
export class GridControllerService {
  
  public dataSource: IGridDataSource = new GridDataSource()

  public cell       = new CellOperationFactory   (this).factory
  public row        = new RowOperationFactory    (this).factory
  public grid       = new GridOperationFactory   (this).factory
  public column     = new ColumnOperationFactory (this, this.prefs).factory
  public selection  = new GridSelectionController(this, this.row).factory

  public keyboardTriggers = this.grid.KeyBindings.manualKeyboardTriggers

  public defaultDateFormat = 'yyyy/MM/dd'
  public defaultDateTimeFormat = 'yyyy/MM/dd h:mm a'
  
  private _subs : Set<Subscription> = new Set()

  public iconClass = this.iconRegistry.getDefaultFontSetClass().filter((fontSetClass) => fontSetClass.includes('material') || fontSetClass.includes('symbols'))[0]
  ??  this.iconRegistry.getDefaultFontSetClass()[0];

  constructor(
    private readonly events  : GridEventsService,
    public  readonly prefs   : LocalPreferencesService,
    public  readonly localize: LocalizationService,
    public  readonly datePipe: DatePipe,
    public  readonly dialogs : MatDialog,
    public  readonly uploads : GridFileUploadService,
    private readonly iconRegistry: MatIconRegistry,
    icons: IconsService,
  ) {

    icons.init();

    const { gridEvents } = this
    const addSubscription = (s: Subscription) => this._subs.add(s)

    addSubscription(gridEvents.CellSelectionChangedEvent.onChanges().subscribe(selectionChange => {
      if (selectionChange[1] === null || (selectionChange[1]?.cellCount === 0 && selectionChange[1].secondarySelection?.cellCount === 0)) {
        this.row.clearSelection()
        this.cell.clearSelection()
        return
      }
      this.row.SelectedRowsChanged.run(selectionChange)
      this.cell.SelectedCellsChanged.run(selectionChange)
    }))

    // Row pre-selection changed
    addSubscription(gridEvents.RowPreselectedEvent.onChanges().subscribe(selectionChange => {
      this.row.PreSelectedRowsChanged.run(selectionChange)
    }))

    // Column order changed
    addSubscription(gridEvents.ColumnsChangedEvent.on().subscribe(_ => {
      this.cell.SelectedCellsChanged.run([undefined, this.selection.latestSelection()])
      this.row.RowComponents.getAll().forEach(row => row.detectChanges())
    }))

    // Column sort changed
    addSubscription(gridEvents.ColumnSortByChangedEvent.on().subscribe(_ => {
      if (gridEvents.GridFilterStringChangedEvent.state) {
        this.row.FilterRows.run()
      }
    }))

    // Column width changed
    addSubscription(gridEvents.ColumnWidthChangedEvent.on().subscribe(colWidths => {
      if(colWidths.changedOne) {
        const column = this.cell.CellComponents.findForColumn(colWidths.changedOne)
        this.column.SetColumnWidth.run(column, colWidths.columns.get(colWidths.changedOne) ?? 0)
      } else {
        for (const [columnKey, width] of colWidths.columns) {
          const column = this.cell.CellComponents.findForColumn(columnKey)
          this.column.SetColumnWidth.run(column, width)
        }
      }
    }))

    // Cell focus changed
    addSubscription(gridEvents.CellFocusChangedEvent.onChanges().subscribe(focusedCellChange => {
      const [ _, nextFocused ] = focusedCellChange
      gridEvents.EditingCellChangedEvent.emit(null)
      this.cell.FocusedCellChanged.run(focusedCellChange)
      this.row.FocusedRowChanged.run(focusedCellChange)
      if (nextFocused && !this.cell.GetCellIsValid.run(nextFocused)) {
        const state = this.cell.GetCellValue.run(nextFocused)?.validationState
        if (state) window.requestAnimationFrame(_ => this.cell.SetCellValidationDialog.run(state))
      }
    }))

    // Draft value changed
    addSubscription(gridEvents.CellDraftValueChangedEvent.on().subscribe(change => {
      const row  = this.row.RowComponents.findWithPrimaryKey(change.rowKey)
      const cell = this.cell.CellComponents.findWithCoords(change)
      if (row)  this.row.CheckRowIcon.run(row)
      if (cell) this.cell.SetCellStylesFromMeta.run(cell)
    }))

    // Editing cell changed
    addSubscription(gridEvents.EditingCellChangedEvent.onChanges().subscribe(change => {
      const [prev, next] = change
      if (prev?.coordinates.compositeKey !== next?.coordinates.compositeKey) prev?.stopEdit()     
      next?.startEdit()
    }))

    // Grid filter changed
    addSubscription(gridEvents.GridFilterStringChangedEvent.on().subscribe(filter => this.row.FilterRows.run(filter)))

    // Handle paste event
    addSubscription(fromEvent<ClipboardEvent>(window, 'paste').subscribe(clipboard => {
      const inputIsFocused    = new Set(['INPUT', 'TEXTAREA']).has(document.activeElement?.tagName.toUpperCase() ?? '')
      const inputIsInsideCell = HasParentOfClass('cell', document.activeElement as HTMLElement | null)
      if (!inputIsFocused || inputIsInsideCell) {
        const html = clipboard.clipboardData?.getData('text/html')
        const plainText = clipboard.clipboardData?.getData('text/plain')
        this.grid.GridPaste.run({ html, plainText })
      }
    }))

    // Update viewport size when data changes
    addSubscription(gridEvents.GridDataChangedEvent.on().subscribe(_ => {
      window.requestAnimationFrame(_ => this.grid.CheckViewportSize.run())
    }))

    // Setup file drag listeners
    this.grid.GridSetupFileDrag.run()

    // Cell validation changes
    addSubscription(gridEvents.CellValidationStateChangedEvent.on().subscribe(state => {
      this.cell.SetCellValidationDialog.run(state)
      const component = this.cell.CellComponents.findWithCoords(state.cellCoordinates)
      if (component) this.cell.SetCellStylesFromMeta.run(component)
    }))

    // React to metadata changes
    addSubscription(gridEvents.MetadataChangedEvent.on().subscribe(change => {
      let affectedCellComponents = new Set<IGridCellComponent>()
      if  (change.columnKey !== undefined && change.rowKey !== undefined) {
        const coords = new GridCellCoordinates(change.rowKey, change.columnKey)
        const cell = this.cell.CellComponents.findWithCoords(coords)
        if (cell) affectedCellComponents.add(cell)
      } else if (change.rowKey !== undefined) {
        for (const col of this.dataSource.columns) {
          const coords = new GridCellCoordinates(change.rowKey, col.columnKey)
          const cell = this.cell.CellComponents.findWithCoords(coords)
          if (cell) affectedCellComponents.add(cell)
        }
      } else {
        affectedCellComponents = this.cell.CellComponents.getAll()
      }
      affectedCellComponents.forEach(c => this.cell.SetCellStylesFromMeta.run(c))
    }))
    
  }

  public get gridEvents() { return this.events.factory }

  public onDestroy() {
    this._subs.forEach(s => s.unsubscribe())
    this.grid     .onDestroy()
    this.column   .onDestroy()
    this.row      .onDestroy()
    this.cell     .onDestroy()
    this.selection.onDestroy()
    this.dataSource.onDestroy()
    DeleteFromArray(DATA_GRIDS_FOCUSED_TREE, this.grid.GetGridId.run())
    this.events.factory.GridDestroyedEvent.emit()
  }

  public get isInitialised(): boolean { return this.grid.GetIsInitialised.run() }

  public whenInitialised(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.isInitialised) {
        resolve(true)
        return
      }
      this._subs.add(this.events.factory.GridInitialisedEvent.onWithInitialValue().pipe(filter(v => v === true), take(1)).subscribe(_ => resolve(true)));
    })
  }

  public getDateFormat() {
    return this.defaultDateFormat
  }

  public getDateTimeFormat() {
    return this.defaultDateTimeFormat
  }

}

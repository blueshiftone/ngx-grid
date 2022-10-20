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
import { CellOperationFactory } from './cell-operations/_cell-operation.factory'
import { ColumnOperationFactory } from './column-operations/_column-operation.factory'
import { GridOperationFactory } from './grid-operations/_grid-operation.factory'
import { RowOperationFactory } from './row-operations/_row-operation.factory'
import { GridSelectionController } from './selection/grid-selection.controller'

export const DATA_GRIDS_FOCUSED_TREE: string[] = [] 

@Injectable()
export class GridControllerService {
  
  public cell       = new CellOperationFactory   (this).factory
  public row        = new RowOperationFactory    (this).factory
  public grid       = new GridOperationFactory   (this).factory
  public column     = new ColumnOperationFactory (this, this.prefs).factory
  public selection  = new GridSelectionController(this, this.row).factory

  public dataSource: IGridDataSource = new GridDataSource()

  public keyboardTriggers = this.grid.KeyBindings.manualKeyboardTriggers

  public defaultDateFormat = 'yyyy/MM/dd'
  
  private _subs : Set<Subscription> = new Set()

  constructor(
    private readonly events  : GridEventsService,
    public  readonly prefs   : LocalPreferencesService,
    public  readonly localize: LocalizationService,
    public  readonly datePipe: DatePipe,
    public  readonly dialogs : MatDialog,
    public  readonly uploads : GridFileUploadService,
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
        this.column.SetColumnWidth.run(column, colWidths.columns.find(c => c.columnKey === colWidths.changedOne)?.width ?? 0)
      } else {
        for (const el of colWidths.columns) {
          const column = this.cell.CellComponents.findForColumn(el.columnKey)
          this.column.SetColumnWidth.run(column, el.width)
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
      const html = clipboard.clipboardData?.getData('text/html')
      const plainText = clipboard.clipboardData?.getData('text/plain')
      this.grid.GridPaste.run({ html, plainText })
    }))

    // Update viewport size when data changes
    addSubscription(gridEvents.GridDataChangedEvent.on().subscribe(_ => {
      window.requestAnimationFrame(_ => this.grid.CheckViewportSize.run())
    }))

    // Handle action hotkeys
    addSubscription(gridEvents.GridKeyCmdPressedEvent.on().subscribe(event => {
      switch(event.key) {
        
        case 'Ctrl+C': this.selection.CopySelection.run(); break

        case 'Delete': 
          (this.selection.latestSelection()?.rowKeys ?? []).forEach(rowKey => this.row.DeleteRow.buffer(rowKey));
        break

        case 'Backspace': 
          for (const coordinates of this.selection.latestSelection()?.allCellCoordinates() ?? []) {
            if (this.cell.GetCellIsEditable.run(coordinates)) {
              this.cell.CellComponents.findWithCoords(coordinates)?.setValue(null)
              this.cell.SetCellDraftValue.buffer(coordinates)
              this.cell.SetCellValue.run(coordinates, null)
            }
          }
        break

        // Toggle checkboxes
        case 'Enter': 
        case 'Space': 
          const cell = this.cell.GetFocusedCell.run()
          if (cell?.type.name === 'Boolean') cell.typeComponent?.setValue(!cell.typeComponent.value)
        break

      }
    }))

    // Setup file drag listeners
    this.grid.GridSetupFileDrag.run()

    // Cell validation changes
    addSubscription(gridEvents.CellValidationStateChangedEvent.on().subscribe(state => {
      this.cell.SetCellValidationDialog.run(state)
      const component = this.cell.CellComponents.findWithCoords(state.cellCoordinates)
      if (component) this.cell.SetCellStylesFromMeta.run(component)
    }))

    // Listen to events to re-run column validators
    addSubscription(
      combineLatest([
        gridEvents.RowStatusChangedEvent.onChanges().pipe(startWith([undefined, undefined] as const)),
        gridEvents.RowsRevertedEvent.on().pipe(startWith<TPrimaryKey[]>([]))
      ])
      .subscribe(event => {
        const [ statusChangeEvent, revertedEvent ] = event
        const [prev, next] = statusChangeEvent
        if ([...(prev??[]).map(m => m.status), ...(next??[]).map(m => m.status)].includes(ERowStatus.Deleted) || revertedEvent.length) {
          for (const col of this.dataSource.columns) {
            this.cell.ValidateCell.bufferColumnValidation.next([col.columnKey])
          }
        }
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
      this._subs.add(this.events.factory.GridInitialisedEvent.on().pipe(filter(v => v === true), take(1)).subscribe(_ => resolve(true)));
    })
  }

  public getDateFormat() {
    const format = this.localize.getLocalizedString('dateFormat')
    return format === 'dateFormat' ? this.defaultDateFormat : format
  }

}

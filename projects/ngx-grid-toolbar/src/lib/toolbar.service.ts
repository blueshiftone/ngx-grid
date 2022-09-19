import { formatNumber } from '@angular/common'
import { ComponentRef, ElementRef, Injectable, ViewContainerRef } from '@angular/core'
import {
  GridCellCoordinates,
  GridControllerService,
  GridMultiCellEditService,
  IGridCellMeta,
  IGridRow,
  IGridSelectionSlice,
  TColumnKey,
  TPrimaryKey,
} from '@blueshiftone/ngx-grid-core'
import { BehaviorSubject, merge, Subscription } from 'rxjs'

import { EToolbarItemPlacement } from './typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from './typings/interfaces/toolbar-component.interface'
import * as StaticToolbarItemComponents from './ui/static-toolbar/items'

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  public gridController?      : GridControllerService
  public multiCellEditService?: GridMultiCellEditService
  public selectionSlice = new BehaviorSubject<IGridSelectionSlice | null>(null)
  public staticToolbarItems: IToolbarComponent[] = []

  public isCommitEnabled = new BehaviorSubject<boolean>(true)
  public isRevertEnabled = new BehaviorSubject<boolean>(true)

  public staticContainers: {
    primary?: ElementRef<HTMLElement>,
    secondary?: ElementRef<HTMLElement>,
    dropdown?: ElementRef<HTMLElement>,
  } = {}

  public currentMeta: ISelection = this._getAllMetas()

  public cellCount   = 0
  public cellStr     = ''
  
  public recordCount = 0
  public recordStr   = ''
  
  public dirtyRecordsCount = 0
  public dirtyRecordsStr   = ''

  public staticContainerList: { [key in EToolbarItemPlacement]: () => HTMLElement | undefined } = {
    0: () => this.staticContainers.primary?.nativeElement,
    1: () => this.staticContainers.secondary?.nativeElement,
    2: () => this.staticContainers.dropdown?.nativeElement,
  }

  private _subscriptions = new Set<Subscription>()

  constructor() {
    this._subscriptions.add(this.selectionSlice.subscribe(_ => {
      this.cellCount   = this.selectionSlice.value?.selection.cellCount ?? 0
      this.recordCount = this.selectionSlice.value?.rowKeys.length ?? 0
      this.cellStr     = this.cellCount > 0 ? `${formatNumber(this.cellCount, 'en-us')} cell${this.cellCount === 1 ? '' : 's'}` : ''
      this.recordStr   = this.cellCount > 0 ? `${formatNumber(this.recordCount, 'en-us')} record${this.recordCount === 1 ? '' : 's'}` : ''
      this.currentMeta = this._getAllMetas()
      this.setItems()
    }))
  }

  public initialiseStaticToolbar (
    primaryContainer    : ElementRef,
    secondaryContainer  : ElementRef,
    dropdownContainer   : ElementRef,
    itemFactoryContainer: ViewContainerRef,
  ) {
    this.staticContainers.primary   = primaryContainer
    this.staticContainers.secondary = secondaryContainer
    this.staticContainers.dropdown  = dropdownContainer

    for (const component of Object.values(StaticToolbarItemComponents)) {
      const componentRef: ComponentRef<any> = itemFactoryContainer.createComponent(component as any)
      this.staticToolbarItems.push(componentRef.instance)
      componentRef.location.nativeElement.remove()
    }

    if (this.gridController) {
      this._subscriptions.add(merge(
        this.gridController.gridEvents.GridInitialisedEvent.on(),
        this.gridController.gridEvents.GridWasModifiedEvent.on(),
      ).subscribe(_ => {
        this.currentMeta       = this._getAllMetas()
        this.dirtyRecordsCount = this.gridController?.row.dirtyRowsMap.size ?? 0
        this.dirtyRecordsStr   = this.dirtyRecordsCount > 0 ? `${formatNumber(this.dirtyRecordsCount, 'en-us')} record${this.dirtyRecordsCount === 1 ? '' : 's'}` : ''
        this.setItems()
      }))
    }
  }

  public setItems(): void {
    this._clearContainers()
    this.staticToolbarItems.sort((a, b) => a.sortOrder - b.sortOrder)
    for (const item of this.staticToolbarItems) {
      const containerEl = this.staticContainerList[item.placement]()  
      if (containerEl && item.isVisible) {
        containerEl.appendChild(item.element)
        item.element.classList.toggle('disabled', !item.isEnabled)
        item.detectChanges()
      }
    }
  }

  public onDestroy(): void {
    this._subscriptions.forEach(sub => sub.unsubscribe())
  }

  private _clearContainers(): void {
    for (const container of Object.values(this.staticContainerList)) {
      const el = container()
      if (el) el.innerHTML = ''
    }
  }

  private _getAllMetas(): ISelection {

    const output: ISelection = {
      rows: [],
      cells: []
    }

    const controller = this.gridController

    if (!controller) return output

    const rowKeys    = this._getSelectedRowKeys()
    const columnKeys = this._getColumns()

    for (const rowKey of rowKeys) {
      const rowMeta = controller.dataSource.getRow(rowKey)
      if (rowMeta) output.rows.push(rowMeta)
      for (const columnKey of columnKeys) {
        const cellMeta = controller.cell.GetCellMeta.run(new GridCellCoordinates(rowKey, columnKey))
        if (cellMeta) output.cells.push(cellMeta)
      }
    }

    return output
  }

  private _getSelectedRowKeys(): TPrimaryKey[] {
    return this.selectionSlice.value?.rowKeys ?? []
  }

  private _getColumns(): TColumnKey[] {
    return this.gridController?.dataSource.columns.map(c => c.columnKey) ?? []
  }

}

export interface ISelection {
  rows : IGridRow[],
  cells: IGridCellMeta[]
}

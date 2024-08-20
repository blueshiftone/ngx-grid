import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { Injectable, InjectionToken, Injector, ViewContainerRef } from '@angular/core'
import { BehaviorSubject, merge, Subject, Subscription } from 'rxjs'
import { delay, filter, first, skip, takeUntil } from 'rxjs/operators'

import { GridControllerService } from '../controller/grid-controller.service'
import { GridEventsService } from '../events/grid-events.service'
import { EPositionPreference } from '../typings/enums/position-preference.enum'
import { IGridCellComponent, IGridCellType, IGridCellValue, IGridSelectionRange } from '../typings/interfaces'
import { IGridDataType } from '../typings/interfaces/grid-data-type.interface'
import { GridCellCoordinates } from '../typings/interfaces/implementations'
import { GridImplementationFactory } from '../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from '../typings/types'
import CELL_TYPES from '../ui/cell/cell-types'
import { CELL_MULTI_EDITORS } from '../ui/cell/cell-types/value-multi-editing/multi-editors-factory'
import { MultiCellEditInputComponent } from '../ui/grid-overlays/multi-cell-edit-input/multi-cell-edit-input.component'
import { MultiCellEditOverlayComponent } from '../ui/grid-overlays/multi-cell-edit-overlay/multi-cell-edit-overlay.component'
import { DistinctValues } from '../utils/distinct-values'
import { Randomish } from '../utils/randomish'
import { GridOverlayService } from './grid-overlay-service.service'
import { EGridIcon } from './icon.service'
import { OverlayPositionBuilder } from './overlay-position-builder.class'

@Injectable({
  providedIn: 'root'
})
export class GridMultiCellEditService {

  private _overlayRef?: OverlayRef
  private _subscriptions = new Set<Subscription>()
  private _cellType?: IGridCellType
  private _cell?    : IGridCellComponent

  private readonly overlayCSSClassName = 'grid-multi-cell-edit'

  constructor(
    private readonly gridController  : GridControllerService,
    private readonly overlays        : GridOverlayService,
    private readonly overlay         : Overlay,
    private readonly events          : GridEventsService,
    private readonly viewContainerRef: ViewContainerRef
  ) {
    this._subscriptions.add(merge(
      this.events.factory.GridScrollStartedEvent.on(), 
      this.events.factory.CellSelectionChangedEvent.on(),
    ).subscribe(_ => {  
      this._overlayRef?.detach()
    }))
  }

  public onDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  public openCellOverlay(positionStrategy: PositionStrategy, type: IGridDataType, columnKey: TColumnKey, width: number, height: number, value: any = null): IGridCellComponent {
    const attachmentElement = document.createElement('div')
    const cellComponent     = this._createCellComponent(columnKey, type, attachmentElement, value)
    const injector          = Injector.create({ providers: [{ provide: GRID_MULTI_CELL_EDIT, useValue: cellComponent }] })
    const portal            = new ComponentPortal(MultiCellEditOverlayComponent, null, injector)
    const ref               = this._createOverlayRef(positionStrategy, Math.max(175, width), height)
    ref.attach(portal)
    if (!["DropdownMultiSelect", "RichText"].includes(type.name)) {      
      this.events.factory.EditingCellChangedEvent.on()
        .pipe(
            delay(200),
            filter(value => value === null),
            skip(1),
            takeUntil(ref.detachments()))
        .subscribe(_ => ref.detach())
    }

    return cellComponent
  }

  private _createCellComponent(
    columnKey: TColumnKey,
    type     : IGridDataType,
    el       : HTMLDivElement,
    value    : any
  ): IGridCellComponent {

    const pk = Randomish()

    const coords = new GridCellCoordinates(pk, columnKey)

    // Basic implementation of IGridCellComponent and IGridRowComponent
    this._cell = {
      destroyed       : new Subject<void>(),
      column          : this.gridController.dataSource.getColumn(coords.columnKey)!,
      coordinates     : coords,
      detectChanges   : () => {},
      focus           : new BehaviorSubject<boolean>(true),
      typeComponent   : {} as IGridCellType,
      type            : type,
      rowKey          : coords.rowKey,
      element         : el,
      style           : el.style,
      toggleClass     : (className: string, classState: boolean) => el.classList.toggle(className, classState),
      startEdit       : () => this._cellType?.open(),
      stopEdit        : () => this._cellType?.close(),
      setValue        : (val: any) => this._cellType?.receiveValue(val),
      overlays        : this.overlays,
      viewContainerRef: this.viewContainerRef,
      isDisconnected  : true,
      rowComponent    : {
        columns          : [],
        detectChanges    : () => {},
        element          : el,
        firstCellPosition: coords,
        lastCellPosition : coords,
        icon             : new BehaviorSubject<EGridIcon | null>(null),
        index            : 0,
        rowKey           : 0,
        gridRow          : GridImplementationFactory.gridRow('', new Map()),
        toggleClass      : (className: string, classState: boolean) => el.classList.toggle(className, classState),
      },
    }

    var cellType = new CELL_TYPES[type.name](this.gridController, this.overlays, this._cell).initializeValue(value)
    this._cellType = cellType
    this._cell.typeComponent = cellType
    cellType.attachTo(el)

    return this._cell

  }

  public getDistinctType(selection: IGridSelectionRange) {
    
    const cells = selection.allCellCoordinates().filter(coordinates => this.gridController.cell.GetCellIsEditable.run(coordinates))

    if (cells.length < 1 || selection.columnKeys.length > 1) return false

    const types = cells.map<IGridDataType>(coordinates => {
      const cellMeta = this.gridController.cell.GetCellMeta.run(coordinates)
      const col = this.gridController.dataSource.getColumn(coordinates.columnKey)
      return cellMeta?.type ?? col?.type ?? { name: 'Text' }
    })

    if(DistinctValues(types.map(t => t.name)).length === 1) {
      const [type]     = types
      const components = cells.map(cellCoordinates => this.gridController.cell.CellComponents.findWithCoords(cellCoordinates)).filter(cell => cell) as IGridCellComponent[]
      const values     = cells.map(cellCoordinates => this.gridController.cell.GetCellValue.run(cellCoordinates)).filter(v => v) as IGridCellValue[]

      const isDistinctValue = DistinctValues(values.map(v => {
        return typeof v?.value !== 'string' ? JSON.stringify(v.value) : v.value
      })).length === 1

      const initialValue = isDistinctValue ? values[0].value : (type.name === 'RichText' ? '<p></p>' : null)

      const editors = CELL_MULTI_EDITORS[type.name]

      return { cells, type, components, values, initialValue, editors }

    }

    return false
    
  }

  public openValueEditor(position: IMultiCellEditorOpenConfigs, selection: IGridSelectionRange): void {

    const distinctType = this.getDistinctType(selection)

    if (!distinctType) return

    let component = distinctType.components.find(c => typeof c !== 'undefined')
    if (!component) return
    const {clientWidth, clientHeight} = component.element
    
    const {cells, components} = distinctType

    const positionStrategy = this._getPositonStrategy(position, components)

    const cell = this.openCellOverlay(positionStrategy, distinctType.type, selection.getBounds().topLeft.columnKey, clientWidth, clientHeight, distinctType.initialValue)

    if (!cell.typeComponent) return

    cell.typeComponent.valueChanged.pipe(takeUntil(cell.destroyed)).subscribe(_ => { 
      const val = cell.typeComponent!.value
      cells.forEach((cellCoordinates, index) => {
        this.gridController.cell.SetCellValue.run(cellCoordinates, val)
        const component = distinctType.components[index]
        if (component) {
          component.setValue(val)
          this.gridController.cell.SetCellDraftValue.buffer(cellCoordinates)
        }
      })
    })
    
  }

  public async getMultiEditorInput(
    position: IMultiCellEditorOpenConfigs,
    selection: IGridSelectionRange,
    label: string,
    type: 'text' | 'number'
  ): Promise<string | null> {
    this._overlayRef?.detach()
    return new Promise<string  | null>(resolve => {
      const distinctType = this.getDistinctType(selection)
      if (!distinctType) {
        resolve('')
        return
      }
      const { components } = distinctType

      const positionStrategy = this._getPositonStrategy(position, components)

      const configs: IMultiCellInputConfigs = {
        value: null,
        label,
        type,
        close: () => {
          this._overlayRef?.detach()
          resolve(configs.value)
        }
      }
      const injector     = Injector.create({ providers: [{ provide: GRID_MULTI_CELL_INPUT, useValue: configs }] })
      const portal       = new ComponentPortal(MultiCellEditInputComponent, null, injector)
      const ref          = this._createOverlayRef(positionStrategy)
      ref.attach(portal)

    })
  }

  public async runMultiEditor(
    label: string,
    selection: IGridSelectionRange,
    inputPositionStrategy: IMultiCellEditorOpenConfigs<TMultiCellConnectedTo>
  ): Promise<void> {

    const controller = this.gridController

    const distinctType = this.getDistinctType(selection) 
    if (!distinctType) return

    const editorIndex = distinctType.editors.map(e => new e(null, distinctType.type.name)).findIndex(itm => itm.label === label)
    if (editorIndex < 0) return

    const editorClass    = distinctType.editors[editorIndex]
    const editorInstance = new editorClass(null, distinctType.type.name)

    let input = null

    if (editorInstance.requiresInput) {
      const label = this.gridController.localize.getLocalizedString(editorInstance.longLabel ?? editorInstance.label)
      input = await this.getMultiEditorInput(inputPositionStrategy, selection, label, editorInstance.inputType ?? 'text')
      if (!input) return
    }

    for (const cellCoordinates of distinctType.cells) {
      const editor  = new editorClass(controller.cell.GetCellValue.run(cellCoordinates)?.value, distinctType.type.name)
      editor.initialize(controller, cellCoordinates)
      editor.run(input)
    }

  }

  private _getPositonStrategy(position: IMultiCellEditorOpenConfigs, components: IGridCellComponent[]): PositionStrategy {

    let positionStrategy: PositionStrategy

    if(position.strategy === 'element' && position.element) {

      positionStrategy = new OverlayPositionBuilder(this.overlay)
        .connectedToElement(position.element)
        .withPosition(EPositionPreference.TopCentered)
        .withFlexibleDimensions()
        .positionStrategy
      
    } else {

      let coords = {
        x: 0,
        y: 0
      }

      if (components.length) {
        const element  = components[Math.floor(components.length/2)].element
        const bounding = element.getBoundingClientRect()
        coords.x = bounding.x + (bounding.width * .8)
        coords.y = bounding.y
      } else if(position.coords) coords = {...position.coords}

      positionStrategy = new OverlayPositionBuilder(this.overlay)
        .connectedToCoords(coords)
        .withPosition(EPositionPreference.HorizontalRight)
        .withFlexibleDimensions()
        .positionStrategy

    }

    return positionStrategy

  }

  private _createOverlayRef(positionStrategy: PositionStrategy, width?: number, height?: number) {

    if (this._overlayRef) this._overlayRef.detach()

    const ops: OverlayConfig = {
      scrollStrategy  : this.overlay.scrollStrategies.reposition(),
      panelClass      : [this.overlayCSSClassName],
      hasBackdrop     : false,
      width           : width ? `${width}px` : undefined,
      height          : height ? `${height}px` : undefined,
      positionStrategy,
    }

    this._overlayRef = this.overlay.create(ops)
    
    this._overlayRef.detachments().pipe(first()).subscribe(_ => {
      this._cell?.destroyed.next()
      this._overlayRef?.dispose()
      this._overlayRef = undefined
    })
    return this._overlayRef
  }

}

export const GRID_MULTI_CELL_EDIT  = new InjectionToken<IGridCellComponent>('GRID_MULTI_CELL_EDIT')
export const GRID_MULTI_CELL_INPUT = new InjectionToken<IMultiCellInputConfigs>('GRID_MULTI_CELL_INPUT')

export interface IMultiCellInputConfigs {
  value: string | null
  label: string
  type: 'text' | 'number'
  close(): void
}

export type TMultiCellConnectedTo = 'element' | 'coords'

export interface IMultiCellEditorOpenConfigs<T = TMultiCellConnectedTo> { 
  strategy: T,
  element?: HTMLElement,
  coords?: { x: number, y: number } 
}

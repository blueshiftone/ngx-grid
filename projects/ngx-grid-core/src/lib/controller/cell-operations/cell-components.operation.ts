import { IGridCellComponent, IGridCellCoordinates } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class CellComponents extends Operation {

  private readonly cellComponentsByElement = new WeakMap<HTMLElement, IGridCellComponent>()
  private readonly cellComponentsByCoords  = new Map<string,          IGridCellComponent>()
  private readonly cellComponents          = new Set<IGridCellComponent>()
  
  constructor(factory: ICellOperationFactory) { super(factory.gridController) }

  public changePrimaryKey(oldKey: TPrimaryKey, newKey: TPrimaryKey) {
    for (const column of this.dataSource.columns) {
      const oldCoordKey = new GridCellCoordinates(oldKey, column.columnKey).compositeKey
      const newCoordKey = new GridCellCoordinates(newKey, column.columnKey).compositeKey
      const cell = this.cellComponentsByCoords.get(oldCoordKey)
      if (cell) {
        this.cellComponentsByCoords.delete(oldCoordKey)
        this.cellComponentsByCoords.set(newCoordKey, cell)
      }
    }
  }

  public linkElementToCell(el: HTMLElement, cell: IGridCellComponent): void {
    this.cellComponentsByElement.set(el, cell)
  }

  public added(cell: IGridCellComponent) {
    this.cellComponentsByCoords .set(cell.coordinates.compositeKey, cell)
    this.cellComponentsByElement.set(cell.element, cell)
    this.cellComponents.add(cell)
    this._updateCellComponent(cell)
  }

  public changed(cell: IGridCellComponent, oldCoords: IGridCellCoordinates) {
    this.cellComponentsByElement.set(cell.element, cell)
    if(this.cellComponentsByCoords.get(oldCoords.compositeKey) === cell) {
      this.cellComponentsByCoords.delete(oldCoords.compositeKey)
    }
    this.cellComponentsByCoords.set(cell.coordinates.compositeKey, cell)
    const focusedCell    = this.gridEvents.CellFocusChangedEvent.state
    const focusNextValue = focusedCell?.equals(cell.coordinates) ?? false
    if (focusNextValue !== cell.focus.value) cell.focus.next(focusNextValue)
    this._updateCellComponent(cell)
  }

  public removed(cell: IGridCellComponent) {
    this.cellComponents.delete(cell)
    this.cellComponentsByCoords.delete(cell.coordinates.compositeKey)
  }

  public filterWithCoordsIn(coords: Set<IGridCellCoordinates> | undefined): IGridCellComponent[] {
    if (!coords) return []

    return Array.from(coords).filter(coords => this.cellComponentsByCoords.has(coords.compositeKey)).map(coord => this.cellComponentsByCoords.get(coord.compositeKey)) as IGridCellComponent[]
  }

  public findWithCoords(coords?: IGridCellCoordinates): IGridCellComponent | undefined {
    return coords ? this.cellComponentsByCoords.get(coords.compositeKey) : undefined
  }

  public findForColumn(columnKey: string): Set<IGridCellComponent> {
    let output = new Set<IGridCellComponent>()
    this.cellComponents.forEach(cell => {
      if (cell.column.columnKey === columnKey)
      output.add(cell)
    })
    return output
  }

  public findForElement(el: HTMLElement): IGridCellComponent | undefined {
    return this.cellComponentsByElement.get(el)
  }

  public getAll(): Set<IGridCellComponent> {
    return this.cellComponents
  }

  public override onDestroy() {
    this.cellComponentsByCoords.clear()
  }

  private _updateCellComponent(cell: IGridCellComponent): void {
    this.cellOperations.SetCellSelectionClasses.run(cell)
    this.cellOperations.SetFocusedCellClasses.run(cell)
    this.cellOperations.SetCellStylesFromMeta.run(cell)
  }

}

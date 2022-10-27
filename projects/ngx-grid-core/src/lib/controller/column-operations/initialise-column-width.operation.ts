import { IColumnOperationFactory, IGridCellType } from '../../typings/interfaces'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { TColumnKey } from '../../typings/types'
import { BufferOperation } from '../buffer-operation'
import { Operation } from '../operation.abstract'

export class InitialiseColumnWidth extends Operation {

  private readonly columnWidthsMap   = new Map<TColumnKey, number>()
  private readonly headerWidthsMap   = new Map<TColumnKey, number>()
  private readonly commonCellPadding = 14
  private readonly bufferOperation   = new BufferOperation((args: any) => this._measureCellWidth(args))

  constructor(factory: IColumnOperationFactory) {
    super(factory.gridController)
  }

  /**
   * Clear column widths
   * 
   * @remarks
   * This is used when we want to re-calibrate all column widths
   * e.g. before loading a new dataset
   * 
   */
  public reset() {
    this.columnWidthsMap.clear()
  }

  /**
   * A buffered operation to initialize the column widths based on cell type measurements
   * 
   * @param cellType - The cell type component to measure
   * 
   */
  public bufferCellType = (cellType: IGridCellType) => this.bufferOperation.next([cellType])

  /**
   * A buffered operation to initialize header column widths
   * 
   * @param columnWidth - An tuple array of column key and width
   * 
   */
  public bufferHeaderCellWidth = (columnWidth: THeaderCloumnWidth) => this.bufferOperation.next([columnWidth])

  private _measureCellWidth = async (args: [IGridCellType | THeaderCloumnWidth][]) => {

    const existingColumnWidths = new Set(this.columnWidthsMap.keys())
    let wasChanged = false

    const isTHeaderCloumnWidth = (arg: IGridCellType | THeaderCloumnWidth): arg is THeaderCloumnWidth => Array.isArray(arg)

    for (const [cellTypeOrColumnWidth] of args) {
      if (isTHeaderCloumnWidth(cellTypeOrColumnWidth)) {
        const [columnKey, width] = cellTypeOrColumnWidth
        if (existingColumnWidths.has(columnKey)) continue
        this.columnWidthsMap.set(columnKey, Math.max(
          this.headerWidthsMap.get(columnKey) ?? 0,
          this.columnWidthsMap.get(columnKey) ?? 0,
          width + this.commonCellPadding)
        )
        this.headerWidthsMap.set(columnKey, Math.max(
          this.headerWidthsMap.get(columnKey) ?? 0,
          width + this.commonCellPadding)
        )
        wasChanged = true
      } else {
        const cellType = cellTypeOrColumnWidth
        if (existingColumnWidths.has(cellType.coordinates.columnKey)) continue
        this.columnWidthsMap.set(cellType.coordinates.columnKey, Math.max(
          this.headerWidthsMap.get(cellType.coordinates.columnKey) ?? 0,
          this.columnWidthsMap.get(cellType.coordinates.columnKey) ?? 0,
          cellType.measureWidth() + this.commonCellPadding)
        )
        wasChanged = true
      }      
    }

    if (wasChanged) {
      this.gridEvents.ColumnWidthChangedEvent.emit(GridImplementationFactory.gridColumnWidths(new Map(this.columnWidthsMap), null))  
      this.gridEvents.GridInitialisedEvent.emit(true)
    }

  }

}

export type THeaderCloumnWidth = [TColumnKey, number]

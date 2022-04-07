import { ISelectionController } from '../../../typings/interfaces'
import { BaseSelectionOperation } from './base-selection-operation.abstract'

export class EmitNextSelectionSlice extends BaseSelectionOperation {

  constructor(private readonly controller: ISelectionController) {
    super(controller)
  }

  public run(): void {

    const lastSlice = this._getLastSlice()
    const nextSlice = this.controller.GetSelectionSlice.run()

    if (lastSlice === nextSlice) return

    if (lastSlice && nextSlice && this._arraysAreEqual(lastSlice.cells, nextSlice.cells) && this._arraysAreEqual(lastSlice.rows, nextSlice.rows)) return
    
    this.controller.gridEvents.CellsSelectedEvent.emit(nextSlice)

  }

  private _arraysAreEqual(a: any[][], b: any[][]): boolean {
    return this._toType(a) === this._toType(b)
        && a.length === b.length
        && a.every((value, index) => Array.isArray(value) ? this._arraysAreEqual(value, b[index]) : value === b[index])
  }
  
  private _toType (obj: any): string {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)![1].toLowerCase()
  }

  private _getLastSlice() { return this.controller.gridEvents.CellsSelectedEvent.state }

}

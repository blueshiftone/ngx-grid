import { Subject, Subscription } from 'rxjs'
import { buffer, debounceTime, filter, take } from 'rxjs/operators'

import { IColumnOperationFactory, IGridColumnWidth, IGridColumnWidths } from '../../typings/interfaces'
import { GridImplementationFactory } from '../../typings/interfaces/implementations/grid-implementation.factory'
import { DistinctValues } from '../../utils/distinct-values'
import { Operation } from '../operation.abstract'

export class InitialiseColumnWidth extends Operation {

  public values = new Subject<IGridColumnWidth>()
  
  private readonly subs: Set<Subscription> = new Set()
  private readonly maxInitialCellWidth     = 300

  constructor(factory: IColumnOperationFactory) {
    super(factory.gridController)
    this._run()
  }

  public override onDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

  private _run(): void {
    this.values.pipe(buffer(this.values.pipe(debounceTime(0))), take(1)).subscribe(initialWidths => {
      initialWidths.push(...this._getExistingColumnWidths())
      const keys = DistinctValues(initialWidths.map(v => v.columnKey))
      const colWidths = initialWidths.reduce<IGridColumnWidths>((output, element) => {
        output.setWidth(element.columnKey, Math.min(this.maxInitialCellWidth, Math.max(output.getWidth(element.columnKey), element.width)))
        return output
      }, GridImplementationFactory.gridColumnWidths(keys.map(key => ({ columnKey: key, width: 0 })), null))
      this.gridEvents.ColumnWidthChangedEvent.emit(colWidths)
      this.gridEvents.GridInitialisedEvent.emit(true)
    }).add(() => {
      // Restart when grid is re-initialised
      this.subs.add(this.gridEvents.GridInitialisedEvent.on().pipe(filter(v => v === false), take(1)).subscribe(_ => this._run()))
    })
  }

  private _getExistingColumnWidths(): IGridColumnWidth[] {
    return this.gridEvents.ColumnWidthChangedEvent.state?.columns || []
  }

}

import { distinctUntilChanged, filter, startWith, switchMap } from 'rxjs'

import { IGridDataSource, IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/'
import { Operation } from '../operation.abstract'
import { GenericTransformer } from '../transform-pipeline/generic-transformer'

export class FilterRows extends Operation {

  private _keywords = ''
  private _transformerName = 'BasicGridRowFilter'
  private _transformer?: GenericTransformer<IGridRow>

  constructor(factory: IRowOperationFactory) {
    super(factory.gridController)
    this.gridEvents.GridInitialisedEvent.onWithInitialValue().pipe(switchMap(_ => this.gridEvents.GridDataChangedEvent.onWithInitialValue()
      .pipe(startWith(this.dataSource), filter(x => x !== undefined), distinctUntilChanged()))).subscribe(source => {
        const { rows } = (source as IGridDataSource)
        if (!rows.hasTransform(this._transformerName)) {
          this._transformer = new GenericTransformer<IGridRow>(this._transformerName, async () => this._filterROws())
          rows.addTransformation(this._transformer)
        }
      })
  }

  public run(filter: string | undefined = this.gridEvents.GridFilterStringChangedEvent.state) {
    if (filter === undefined) {
      filter = this.gridEvents.GridFilterStringChangedEvent.state ?? ''
    }
    this._keywords = filter
    this._transformer?.touch()
  }

  private _filterROws(): IGridRow[] | undefined {    
      const rows = this._transformer?.prev()?.value ?? []
      let filtered: IGridRow[] = []
      if (this._keywords) {
        const keywords = this._keywords.toLowerCase()
        filtered = rows.filter(row => row.valuesArray.some(v => {
          const rawValue = v.value.value
          if (rawValue.toString() === keywords) return true
          const formattedValue = this.cellOperations.GetFormattedValue.getPlainText(new GridCellCoordinates(row.rowKey, v.columnKey), rawValue)
          return formattedValue.toLowerCase().includes(keywords)
        }))
        return filtered
      } else {
        return undefined
      }
  }

}

import { distinctUntilChanged } from 'rxjs'

import { IGridRow } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { Operation } from '../operation.abstract'
import { GenericTransformer } from '../transform-pipeline/generic-transformer'
import { Transformer } from '../transform-pipeline/transformer.abstract'

export class FilterRows extends Operation {

  private _keywords = ''

  private _filterTransform?: Transformer<IGridRow> = this._createTransformation()

  constructor(factory: IRowOperationFactory) {
    super(factory.gridController)
    this.gridEvents.GridDataChangedEvent.on()
      .pipe(distinctUntilChanged())
      .subscribe(source => {
        this._filterTransform = this._createTransformation()
        source.rows.addTransformation(this._filterTransform)
      })
  }

  public run(filter: string | undefined = this.gridEvents.GridFilterStringChangedEvent.state) {
    if (filter === undefined) {
      filter = this.gridEvents.GridFilterStringChangedEvent.state ?? ''
    }
    this._keywords = filter
    this._filterTransform?.run()
  }

  private _createTransformation() {
    return new GenericTransformer('BasicGridRowFilter', async () => {
      const rows = this._filterTransform?.prev()?.value ?? []
      let filtered: IGridRow[] = []
      if (this._keywords) {
        this._keywords = this._keywords.toLowerCase()
        // Todo: filter foreign key values
        filtered = rows.filter(row => row.valuesArray.map(v => v.value.value).join('').toLowerCase().includes(this._keywords))
        this.dataSource.setRows(filtered, true)
        return filtered
      } else {
        return undefined
      }
    })
  }

}

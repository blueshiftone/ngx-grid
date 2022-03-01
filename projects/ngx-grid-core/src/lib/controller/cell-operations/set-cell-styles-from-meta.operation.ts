import { EMetadataType } from '../../typings/enums'
import { IGridCellComponent } from '../../typings/interfaces'
import { ICellOperationFactory } from '../../typings/interfaces/grid-cell-operation-factory.interface'
import { IGridStyle } from '../../typings/interfaces/grid-style.interface'
import { BaseCellOperation } from './base-cell-operation.abstract'

export class SetCellStylesFromMeta extends BaseCellOperation {
  
  constructor(factory: ICellOperationFactory) { super(factory) }

  public run(cell: IGridCellComponent): void {
    cell.toggleClass('is-invalid', !this.cellOperations.GetCellIsValid.run(cell.coordinates))
    cell.toggleClass('is-editable', this.cellOperations.GetCellIsEditable.run(cell.coordinates) ?? false)
    cell.toggleClass('has-draft-value', this.cellOperations.HasDraftValue.run(cell.coordinates))
    cell.style.backgroundColor = this.cellOperations.GetCellMetaValue.run<IGridStyle>(cell.coordinates, EMetadataType.Style)?.backgroundColor?.toString() ?? ''
  }
  
}

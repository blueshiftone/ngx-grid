import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { BaseMultiEdit } from './base-multi-edit.abstract'

export class ClearValues extends BaseMultiEdit {
  constructor(cellValue: any, cellType: TCellTypeName) { super(cellValue, cellType) }
  public label = 'locClearValues'
  public override requiresInput = false
  public run = () => this.setCellValue(null)
}

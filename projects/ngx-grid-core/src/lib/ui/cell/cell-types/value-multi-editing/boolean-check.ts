import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { BaseMultiEdit } from './base-multi-edit.abstract'

export class BooleanCheck extends BaseMultiEdit {
  constructor(cellValue: any, cellType: TCellTypeName) { super(cellValue, cellType) }
  public label = 'locCheckAll'
  public override requiresInput = false
  public run = () => this.setCellValue(true)
}
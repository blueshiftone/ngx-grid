import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { NumberParser } from '../value-parsing/parsers/number.parser'
import { BaseMultiEdit } from './base-multi-edit.abstract'

export class NumberSubtract extends BaseMultiEdit {
  constructor(cellValue: any, cellType: TCellTypeName) { super(cellValue, cellType) }
  public label = '− Subtract'
  public run   = (input: any) => {
    const inputNumberTest = new NumberParser(input).run()
    if (inputNumberTest.isInvalid) return
    const value = this.cellValue ?? 0
    this.setCellValue(value - inputNumberTest.transformedValue)
  }
}

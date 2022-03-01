import { TCellTypeName } from '../../../../typings/types/cell-type-name.type'
import { ParseDate } from '../../../../utils/parse-date-string'
import { DateParser } from '../value-parsing/parsers/date.parser'
import { NumberParser } from '../value-parsing/parsers/number.parser'
import { BaseMultiEdit } from './base-multi-edit.abstract'

export class DateAddDays extends BaseMultiEdit {
  constructor(cellValue: any, cellType: TCellTypeName) { super(cellValue, cellType) }
  public label = 'Add days'
  public run   = (input: any) => {
    const dateTest   = new DateParser(this.cellValue).run()
    const numberTest = new NumberParser(input).run()
    if (dateTest.isValid && numberTest.isValid) {
      const date = ParseDate(dateTest.transformedValue)
      if (!date) return
      const days = numberTest.transformedValue
      date.setDate(date.getDate() + days)
      this.setCellValue(date)
    }
  }
}

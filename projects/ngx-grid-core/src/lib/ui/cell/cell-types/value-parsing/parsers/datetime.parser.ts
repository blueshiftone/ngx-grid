import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { ParseDateTime } from '../../../../../utils/parse-datetime-string'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class DateTimeParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  // Parses a datetime string into a Date object
  public run(): IGridValueParsingResult<Date> {

    if (this.initialValue instanceof Date) return this.passed(this.initialValue)
    
    if (typeof this.initialValue !== 'string') return this.failed()

    const dateObj = ParseDateTime(this.initialValue)

    if (!dateObj) return this.failed()
    
    return this.passed(dateObj)
  }
}

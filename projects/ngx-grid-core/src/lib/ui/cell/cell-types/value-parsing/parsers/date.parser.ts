import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { ParseDate } from '../../../../../utils/parse-date-string'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class DateParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<string> {

    if (this.initialValue instanceof Date) return this.passed(this._dateToString(this.initialValue))
    
    if (typeof this.initialValue !== 'string') return this.failed()

    const dateObj = ParseDate(this.initialValue)

    if (typeof dateObj === 'undefined') return this.failed()

    return this.passed(this._dateToString(dateObj))
  }

  
  private _dateToString(date: Date): string {
    return `${date.getFullYear()}/${this._pad(date.getMonth() + 1)}/${this._pad(date.getDate())}`
  }

  private _pad = (n: number) => n.toString().padStart(2, '0')

}

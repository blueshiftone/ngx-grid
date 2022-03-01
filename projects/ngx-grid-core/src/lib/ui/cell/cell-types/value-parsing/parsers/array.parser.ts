import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { ParseCSV } from '../../../../../utils/parse-csv'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class ArrayParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<any[]> {
    
    if (Array.isArray(this.initialValue)) return this.passed()
    
    if (typeof this.initialValue === 'string') return this.passed(ParseCSV(this.initialValue)[0])

    return this.failed()
  }
}

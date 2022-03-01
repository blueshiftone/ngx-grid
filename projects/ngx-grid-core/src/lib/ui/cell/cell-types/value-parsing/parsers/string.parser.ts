import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class StringParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }
  public run(): IGridValueParsingResult<string> {
    return this.passed(this.initialValue.toString())
  }
}

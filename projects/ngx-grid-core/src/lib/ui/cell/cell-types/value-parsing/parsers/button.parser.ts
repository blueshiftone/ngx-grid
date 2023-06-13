import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class ButtonParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<any[]> {
    const val = this.initialValue
    // IButtonCellValue
    if (typeof val === 'object' && val !== null && !Array.isArray(val) && 'text' in val && 'action' in val) {
      return this.passed(val)
    }
    return this.failed()
  }
}

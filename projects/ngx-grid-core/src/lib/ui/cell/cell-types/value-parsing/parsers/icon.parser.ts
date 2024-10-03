import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class IconParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<any[]> {
    const val = this.initialValue
    // IIconCellValue
    if (typeof val === 'object' && val !== null && !Array.isArray(val) && 'key' in val && 'size' in val && typeof val.size === 'number') {
      return this.passed(val)
    }
    return this.failed()
  }
}

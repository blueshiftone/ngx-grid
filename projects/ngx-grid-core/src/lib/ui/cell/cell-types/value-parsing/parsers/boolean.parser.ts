import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class BooleanParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<boolean> {

    let val = this.initialValue

    if (typeof val === 'boolean') return this.passed()

    if ([0, 1].includes(parseInt(val))) return this.passed(parseInt(val) === 1)

    if (typeof val === 'string') {
      val = val.trim().toLowerCase()
      if (['true', 'false', ''].includes(val)) return this.passed(val === 'true')
    }

    if (val === null || typeof val === 'undefined') return this.passed(false)

    return this.failed()
    
  }
}

import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

/*

  Should validate and parse these strings:
  "1209.576"
  "$1,209.58"
  "22.0%"
  "9196.98"
  "$           1,209.58"

*/

export class NumberParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<number> {

    if (typeof this.initialValue === 'number') return this.passed()

    if (typeof this.initialValue === 'string') {

      let finalVal = this.initialValue.replace(/\s|\,/g, '')

      if (finalVal === '') return this.failed()

      const match = finalVal.match(/^(?:[^\d\.]{0,2})(\d+)?(?:\.(\d+))?(?:[^\d]{0,2})$/)

      if (!match) return this.failed()

      let [result, integer, decimals] = match
      if ((integer ?? decimals ?? null) === null) return this.failed()
      integer = integer ?? 0
      
      let transformedValue = parseFloat(`${integer}${typeof decimals !== 'undefined' ? `.${decimals}` : ``}`)

      if (Number.isNaN(transformedValue)) return this.failed()

      if (this.initialValue.includes('%')) transformedValue /= 10

      return this.passed(transformedValue)

    } else return this.failed()

  }
}

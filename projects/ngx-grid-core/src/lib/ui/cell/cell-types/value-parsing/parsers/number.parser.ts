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
  "-$   200.00"
  "-5"

*/

export class NumberParser extends BaseParser implements IParsingTest {
  constructor (public readonly initialValue: any) { super() }

  public run(): IGridValueParsingResult<number> {

    if (typeof this.initialValue === 'number') return this.passed()

    if (typeof this.initialValue === 'string') {

      let finalVal = this.initialValue.replace(/[^0-9\.\-]/g, '')

      if (finalVal === '') return this.failed()

      const match = finalVal.match(/^(-?(?:[0-9]+)?)?\.?([0-9]+)?$/)

      if (!match) return this.failed()

      let [_, integer, decimals] = match
      if ((integer ?? decimals ?? null) === null) return this.failed()
      if (integer === '-') integer = '-0'
      integer = integer ?? 0
      
      let transformedValue = parseFloat(`${integer}${typeof decimals !== 'undefined' ? `.${decimals}` : ``}`)

      if (Number.isNaN(transformedValue)) return this.failed()

      if (this.initialValue.includes('%')) transformedValue /= 100

      return this.passed(transformedValue)

    } else return this.failed()

  }
}

import { IGridValueParsingResult } from '../../../../../typings/interfaces'
import { BaseParser } from './base-parser.abstract'
import { IParsingTest } from './parsing-test.interface'

export class ColorParser extends BaseParser implements IParsingTest {
  constructor(public readonly initialValue: string) { super() }

  /*
   *  NOTES 
   *  Outputs hex format
   *  Can parse rgb and rgba input (drops alpha value after parsing rgba)
   */

  public run(): IGridValueParsingResult<string> {

    let val = this.initialValue

    const isHex = (val: string) => /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val) !== null

    if (isHex(val)) return this.passed()

    const rgbMatch = /^rgb(?:a)?(?:\s+)?\((?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?,(?:\s+)?(\d+)(?:\s+)?,?(?:\s+)?([0-9\.]+)?(?:\s+)?\)$/i.exec(val)
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch
      const hex = `#${[r, g, b].map(v => parseInt(v).toString(16).padStart(2, '0')).join('')}`
      if (isHex(hex)) return this.passed(hex)
    }

    return this.failed()

  }
}

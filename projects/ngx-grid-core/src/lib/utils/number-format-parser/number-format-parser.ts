import { CharParser } from './char-parser'
import { NumberFormater } from './number-formatter'

export class NumberFormatParser {
  
  private static parsers = new Map<string, NumberFormatParser>()

  public positive: NumberFormater
  public negative: NumberFormater
  public zeros: NumberFormater

  public static getParser(numberFormatString: string): NumberFormatParser {
    return this.parsers.get(numberFormatString) ?? new NumberFormatParser(numberFormatString)
  }

  constructor(private _numberFormatstring: string) {
    
    const [positive, negative, zeros] = this._parse()
    
    this.positive = positive
    this.negative = negative
    this.zeros    = zeros

    NumberFormatParser.parsers.set(_numberFormatstring, this)

  }

  public getHtml(val: number): string {
    if (val === 0) {
      return this.zeros.getHtml(val)
    } else if (val < 0) {
      return this.negative.getHtml(val)
    } else {
      return this.positive.getHtml(val)
    }
  }

  public getPlainText(val: number): string {
    const html = this.getHtml(val)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.innerText
  }

  private _parse(): [NumberFormater, NumberFormater, NumberFormater] {
    
    const [positiveStr, negativeStr, zeroStr] = this._numberFormatstring.split(';')
    
    const positive = this._parsePart(positiveStr)
    const negative = negativeStr ? this._parsePart(negativeStr) : positive
    const zero     = zeroStr ? this._parsePart(zeroStr) : positive

    return [positive, negative, zero]

  }

  private _parsePart(formatPart: string): NumberFormater {

    let   parser  = new CharParser(formatPart)
    const color   = parser.getColorString()
    const content = parser.parseChars()

    return new NumberFormater(content, color)

  }
}

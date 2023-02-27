import { IParsedChar } from './char-parser'

export class NumberFormater {
  
  private _valueNode: IParsedChar
  
  constructor(
    private _content: IParsedChar[],
    private _color = ''
  ) {
    const valueNode = _content.find(c => c.numberFormat !== undefined)
    if (valueNode === undefined) throw new Error(`Couldn't find value node in number format string.`)
    else this._valueNode = valueNode
  }

  public getHtml(numberVal: number): string {
    var output: string[] = []
    for (const item of this._content) {
      if (item === this._valueNode) {
        output.push(`<span class="number-val">${this._parseNumberValue(numberVal)}</span>`)
      }
      else if (item.html) output.push(item.html)
    }
    if (this._color) {
      output.unshift(`<span class="number-color" style="color: ${this._color}">`)
      output.push('</span>')
    }
    return output.join(`\r\n`)
  }

  private _parseNumberValue(input: number): string {

    let { minimumIntegerDigits, maximumFractionDigits, minimumFractionDigits, separateThousands, scaleFactor } = this._valueNode.numberFormat!

    while (scaleFactor > 0) {
      input /= 1000
      scaleFactor--
    }

    return new Intl.NumberFormat('en-AU', { // Todo localize this according to provided locale
      useGrouping: separateThousands ? true : false,
      maximumFractionDigits,
      minimumFractionDigits,
      minimumIntegerDigits,
    }).format(Math.abs(input))

  }

}

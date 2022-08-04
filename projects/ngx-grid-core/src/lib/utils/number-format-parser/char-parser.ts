export interface IParsedChar {
  originalChars: string
  html?: string
  numberFormat?: {
    minimumIntegerDigits: number
    maximumFractionDigits: number
    minimumFractionDigits: number
    separateThousands: boolean
    scaleFactor: number
    isPercent: boolean
  }
}

export class CharParser {

  private _allowedDisplayChars = new Set([`+`, `(`, `:`, `^`, `'`, `{`, `<`, `=`, `-`, `/`, `)`, `!`, `&`, `~`, `}`, `>`, ` `, `¢`, `£`, `$`])

  private _allowedNumberChars = new Set([`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `#`, `?`, `.`])

  private _chars: string[]

  constructor(chars: string) {
    this._chars = chars.split('')
  }

  private _takeCharsUntil(char: string): string[] {
    const output: string[] = []
    while(this._chars.length) {
      const curChar = this._chars.shift()! 
      output.push(curChar)   
      if (curChar === `\\`) {  
        output[output.length-1] = this._chars.shift()!
        continue
      }
      if (curChar === char) break
    }
    return output
  }

  public getColorString(): string | undefined {
    if (this._chars[0] === '[') {
      const colorChars = this._takeCharsUntil(']')
      colorChars.shift()
      colorChars.pop()
      return colorChars.join('')
    }
    return undefined
  }

  public parseChars(): IParsedChar[] {
    const output: IParsedChar[] = []
    const isPercent = this._chars.includes('%')
    if (isPercent) this._chars.splice(this._chars.indexOf('%'), 1)
    while (this._chars.length) {
      const char = this._chars.shift()!
      switch(char) {
        case `*`:
          const repeaterChar = this._chars.shift()!
          if (repeaterChar !== ' ') console.warn(`Unsupported repeating char '${repeaterChar}'`)
          output.push({ originalChars: `${char}${repeaterChar}`, html: '<span class="greedy"></span>' })
        break;
        case `"`:
          const textStr = this._takeCharsUntil('"')
          const item = { html: '', originalChars: `${char}${textStr.join('')}` }
          textStr.pop()
          item.html = `<span class="txt-str">${textStr.join('')}</span>`
          output.push(item)
        break;
        case `_`:
          const spacerChar = this._chars.shift()!
          output.push({ html: `<span class="spacer-char">${spacerChar}</span>`, originalChars: `${char}${spacerChar}` })
        break;
        default:  
          if (this._allowedDisplayChars.has(char)) {
            
            output.push({ html: `<span class="txt-str">${char}</span>`, originalChars: char })

          } else if (this._allowedNumberChars.has(char)) {

            let numberFormatStr = `${char}${this.toString()}`.match(/^((?:\#|\.|[0-9])[\#\,0-9\.]+)/)![0]
            for (let i=0; i<numberFormatStr.length-1; i++) this._chars.shift()

            const item: IParsedChar = {
              originalChars: numberFormatStr
            }

            let maximumFractionDigits = 0
            let minimumFractionDigits = 0
            let minimumIntegerDigits = 0
            let separateThousands = false
            const scaleFactor = numberFormatStr.match(/([\,]+)$/)?.[0].length ?? 0
            if (scaleFactor > 0) numberFormatStr = numberFormatStr.replace(/([\,]+)$/, '')

            let [wholeNumbers, decimalPlaces] = numberFormatStr.split('.') as (string | undefined)[]

            if (decimalPlaces) {
              maximumFractionDigits = decimalPlaces.length
              minimumFractionDigits = decimalPlaces.match(/[0-9]+/)?.[0].length ?? 0
            }

            if ((wholeNumbers ?? '').match(/(?:\#|[0-9])\,(?:\#|[0-9])/)) {
              separateThousands = true
              wholeNumbers = (wholeNumbers ?? '').replace(/\,/g, '')
            }

            minimumIntegerDigits = (wholeNumbers ?? '').match(/[0-9]+/)?.[0].length ?? 0

            item.numberFormat = {minimumFractionDigits, minimumIntegerDigits, maximumFractionDigits, separateThousands, scaleFactor, isPercent}     

            output.push(item)

            if (isPercent) {
              output.push({ originalChars: '%', html: '<span class="txt-str percent-char">%</span>' })
            }
   
          } else {
            console.warn(`Skipped chars ${char} when parsing number format string.`)
          }
        break;
      }
    }
    return output
  }

  public toString() { return this._chars.join('') }

}
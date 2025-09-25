export class CharacterSizer {
  
  private static _charCache: Map<string, number> = new Map()
  
  private static _canvas = document.createElement('canvas')
  
  private static _context = this._canvas.getContext('2d')!
  
  private static _lastSeenFont: string | null = null

  // Canvas seems to render the text at a slightly larger scale than when rendered in the browser
  private static _scaleFactor = 0.9249762583095916

  /**
   * Returns the width of given text in pixels
   *
   * @param text - The text to measure
   * @param font - The font to use
   * 
   */
  public static measure(text: string, font: string, maxWidth = Infinity): number {
    let width = 0
    if (!text) return width
    for (const char of text) {
      if (width > maxWidth) break
      if (!this._charCache.has(char)) this._charCache.set(char, this._measureChar(char, font))
      width += this._charCache.get(char)!
    }
    return width * this._scaleFactor
  }

  private static _measureChar(char: string, font: string): number {
    if (this._lastSeenFont !== font) {
      this._context.font = font
      this._lastSeenFont = font
    }
    return this._context.measureText(char).width
  }

}

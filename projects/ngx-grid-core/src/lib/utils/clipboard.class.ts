
export class Clipboard {

  private _clipboardFormats: Record<string, ClipboardItemData> = {}

  public setHTML      = (html: string) => this._set('text/html', html)
  public setPlainText = (txt: string)  => this._set('text/plain', txt)

  private _set(type: string, txt: string): Clipboard {
    this._clipboardFormats[type] = this._createBlob(type, txt)
    return this
  }

  public async write(): Promise<void> {
    try {
      await navigator.clipboard.write([new ClipboardItem(this._clipboardFormats)])
    } catch(e) {
      console.error(e)
    }
  }

  private _createBlob(type: string, data: any): any {
    return new Blob([data], { type })
  }

}

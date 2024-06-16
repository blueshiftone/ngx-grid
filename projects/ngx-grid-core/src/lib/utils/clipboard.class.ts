
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
      var isNavigatorClipboardAllowed = false
      if (navigator.clipboard && window.isSecureContext && document.hasFocus()) {
        if (navigator.permissions) {
          navigator.permissions.query({ name: 'clipboard-read' as PermissionName })
            .then(permissionStatus => {
              if (permissionStatus.state === 'granted') {
                isNavigatorClipboardAllowed = true
              }
            })
        }
      }
      if (isNavigatorClipboardAllowed) {
        await navigator.clipboard.write([new ClipboardItem(this._clipboardFormats)])
      } else {
        const textarea = document.createElement('textarea');
        const clipboardData = (await this._clipboardFormats['text/plain']);
        const text = clipboardData instanceof Blob ? await clipboardData.text() : clipboardData.toString();
        textarea.value = text
    
        // Move the textarea outside the viewport to make it invisible
        textarea.style.position = 'absolute';
        textarea.style.left = '-99999999px';
    
        document.body.prepend(textarea);
    
        // highlight the content of the textarea element
        textarea.select();
    
        try {
          document.execCommand('copy');
        } catch (err) {
          console.log(err);
        } finally {
          textarea.remove();
        }
      }
    } catch(e) {
      console.error(e)
    }
  }

  private _createBlob(type: string, data: any): any {
    return new Blob([data], { type })
  }

}

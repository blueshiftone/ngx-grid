import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { WINDOW } from '../../../../utils/window'
import { MARK_DOWN_TOOLBAR, MarkdownToolbarComponent } from '../markdown-toolbar/markdown-toolbar.component'

@Component({
  selector: 'app-hyperlink-popup',
  templateUrl: './hyperlink-popup.component.html',
  styleUrls: ['./hyperlink-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HyperlinkPopupComponent implements OnInit {

  private _popupFnName = Math.random().toString(36).substr(2)

  constructor(
    @Inject(MARK_DOWN_TOOLBAR) public toolbar: MarkdownToolbarComponent,
    @Inject(WINDOW) private readonly window  : Window,
    private readonly elRef                   : ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {

    (<any>this.window)[this._popupFnName + 'ValueChange'] = (value: string) => this.setValue(value);
    (<any>this.window)[this._popupFnName + 'KeyPress']    = (key: string)   => this.checkKey(key);

    const color       = window.getComputedStyle(this.elRef.nativeElement).backgroundColor
    const colorScheme = document.documentElement.style.colorScheme

    const iframe = document.createElement('iframe')
    this.elRef.nativeElement.appendChild(iframe)
    if (!iframe.contentWindow) return
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(
      `<html>
        <head>
          <style type="text/css">
            html {
              color-scheme: ${colorScheme};
            }
            html, body, input {
              background-color: ${color};
            } 
            body {
              margin: 0;
              font: 400 14px / 20px Roboto, "Helvetica Neue", Arial, sans-serif
            }
            input {
              border: none;
              outline: none;
              width: 150px;
            }
          </style>
        </head>
        <body onload="document.getElementById('input').select()">
          <input 
            type="text"
            autocomplete="off"
            value="${this.toolbar.overlayData || ''}"
            placeholder="https://..."
            id="input"
            oninput="parent['${this._popupFnName}ValueChange'](this.value)"
            onkeypress="parent['${this._popupFnName}KeyPress'](event.key)"
          >
        </body>
      </html>`
    )
    iframe.contentWindow.document.close()
  }

  public setValue = (value: string)  => this.toolbar.overlayData = value
  public checkKey = (key: string)    => key === 'Enter' && this.toolbar.closeOverlay()
}

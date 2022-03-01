import { Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

export enum EGridIcon {
  CheckedBox                 = 'checked-box.svg',
  CheckBox                   = 'check-box.svg',
  Check                      = 'check.svg',
  Asterisk                   = 'asterisk.svg',
  Cross                      = 'cross.svg',
  Copy                       = 'copy.svg',
  Paste                      = 'paste.svg',
  Delete                     = 'delete.svg',
  EditPen                    = 'edit-pen.svg',
  TriangleArrowRight         = 'triangle-arrow-right.svg',
  InsertAtTop                = 'insert-at-top.svg',
  InsertAboveSelection       = 'insert-above-selection.svg',
  InsertAtBottom             = 'insert-at-bottom.svg',
  InsertBelowSelection       = 'insert-below-selection.svg',
  MultiEdit                  = 'multi-edit.svg',
  SimpleSelector             = 'simple-selector.svg',
  ExclamationMark            = 'exclamation-mark.svg',
  ClipboardCheckCross        = 'clipboard-check-cross.svg',
  Italic                     = 'italic.svg',
  Blockquote                 = 'blockquote.svg',
  Strike                     = 'strike.svg',
  Underline                  = 'underline.svg',
  Bold                       = 'bold.svg',
  BulletList                 = 'bulletlist.svg',
  OrderedList                = 'orderedlist.svg',
  Code                       = 'code.svg',
  Hyperlink                  = 'hyperlink.svg',
  Paragraph                  = 'paragraph.svg',
  Heading1                   = 'heading-1.svg',
  Heading2                   = 'heading-2.svg',
  Link                       = 'link.svg',
 }

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  private _iconPath = '/assets/icons/'

  constructor(
    private readonly iconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) { }

  public init(): void {
    const iconNames = Object.keys(EGridIcon) as (keyof typeof EGridIcon)[]
    for (const iconFileName of iconNames) {
      this.iconRegistry.addSvgIcon(
        iconFileName,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${this._iconPath}${EGridIcon[iconFileName]}`)
      )
    }
  }
}

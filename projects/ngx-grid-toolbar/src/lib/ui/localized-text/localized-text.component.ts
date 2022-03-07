import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { LocalizationService } from '../../services/localization.service'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  selector: 'lib-localized-text',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalizedTextComponent extends AutoUnsubscribe implements OnInit {

  private _initialStringValue = ''
  private _txtNode: Text

  constructor(
    private readonly localization: LocalizationService,
    private readonly elRef : ElementRef<HTMLElement>,
    @Inject(DOCUMENT) 
    private readonly doc: Document,
  ) {
    super()
    this._txtNode = this.doc.createTextNode('')
  }

  ngOnInit(): void {
    if (!this._el.parentElement) {
      console.error(`Element has no parent to apppend the localized text node on`)
      console.error(this._el)
      return
    }
    this._el.parentElement.insertBefore(this._txtNode, this._el)
    this._el.remove()
    this.addSubscription(this.localization.changes.subscribe(_ => this._setTextValue()))
  }

  ngAfterViewChecked(): void {
    if (this._el.innerText === this._initialStringValue) return
    this._initialStringValue = this._el.innerText
    this._setTextValue()
  }

  private _setTextValue(): void {
    this._txtNode.nodeValue = this.localization.getLocalizedString(this._initialStringValue)
  }

  private get _el(): HTMLElement {
    return this.elRef.nativeElement
  }

}

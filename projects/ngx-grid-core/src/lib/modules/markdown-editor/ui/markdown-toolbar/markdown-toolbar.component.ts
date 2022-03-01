import { ConnectedPosition, Overlay } from '@angular/cdk/overlay'
import { ComponentPortal, ComponentType } from '@angular/cdk/portal'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  InjectionToken,
  Injector,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { fromEvent } from 'rxjs'
import { first, takeUntil } from 'rxjs/operators'

import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'
import { IMarkdownEditorAction, MarkdownService } from '../../markdown.service'
import { HyperlinkPopupComponent } from '../hyperlink-popup/hyperlink-popup.component'

@Component({
  selector: 'markdown-editor-toolbar',
  templateUrl: './markdown-toolbar.component.html',
  styleUrls: ['./markdown-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownToolbarComponent extends AutoUnsubscribe implements OnInit {

  private readonly overlayClassName = 'markdown-editor-toolbar-overlay'

  @ViewChildren('buttons') public buttons?: QueryList<ElementRef<HTMLButtonElement>>

  private _overlayRef = this.overlay.create({
    scrollStrategy: this.overlay.scrollStrategies.reposition(),
    panelClass    : this.overlayClassName,
    backdropClass : 'transparent-backdrop'
  })

  public overlayData: any

  constructor(
    public  readonly editor : MarkdownService,
    public  readonly cd     : ChangeDetectorRef,
    private readonly overlay: Overlay,
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.editor.activeActions.subscribe(_ => this.cd.detectChanges()))
    this.addSubscription(this.editor.enabledActions.subscribe(_ => this.cd.detectChanges()))
  }

  public override appOnDestroy(): void {
    this.closeOverlay()
    this._overlayRef.dispose()
  }

  public async run(action: IMarkdownEditorAction): Promise<void> {
    const attrs: { [key: string]: any } = {}
    if (action.proseName === 'link' && await this._linkPopup(action, attrs) === false) return
    this.editor.run(action, attrs)
  }

  public closeOverlay(): void {
    this._overlayRef.detach()
  }

  private async _linkPopup(action: IMarkdownEditorAction, attrs: { [key: string]: any }) {
    this.overlayData = this.editor.selectLink() || undefined
    const promise = new Promise<boolean>(resolve => {
      const el = this._getActionButtonElement(action)
      if (typeof el === 'undefined') throw new Error('Unable to determine action button element')
      this._openOverlay(el, HyperlinkPopupComponent)
      this._overlayRef.detachments().pipe(first()).subscribe(_ => {
        if (this.overlayData) attrs['href'] = this.overlayData
        resolve(typeof this.overlayData !== 'undefined')
      })
    })
    return promise
  }

  private _openOverlay(el: HTMLElement | ElementRef, component: ComponentType<any>): void {
    this._connectOverlayTo(el)
    const componentPortal = new ComponentPortal(component, null, this._createInjector())
    this._overlayRef.attach(componentPortal)
    fromEvent<MouseEvent>(document, 'mousedown').pipe(takeUntil(this._overlayRef.detachments())).subscribe(e => {
      if (!this._hasParentOfClass(this.overlayClassName, e.target as HTMLElement)) this.closeOverlay()
    })
  }

  private _getActionButtonElement(a: IMarkdownEditorAction): ElementRef<HTMLButtonElement> | undefined {
    if (!this.buttons) throw new Error('Button element list is undefined')
    const idx = this.editor.actions.indexOf(a)
    return this.buttons.get(idx)
  }

  private _connectOverlayTo(el: ElementRef | HTMLElement): void {

    const positions: ConnectedPosition[] = 
     [{ originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
      { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' }]

    let posStrategy = this.overlay.position().flexibleConnectedTo(el).withFlexibleDimensions().withPositions(positions)

    this._overlayRef.updatePositionStrategy(posStrategy)

  }

  private _createInjector() {
    return Injector.create({ providers: [{ provide: MARK_DOWN_TOOLBAR, useValue: this }] })
  }

  private _hasParentOfClass(c: string, e: HTMLElement | null): boolean {
    if (!e) return false
    if (e.classList.contains(c)) return true
    return this._hasParentOfClass(c, e.parentElement)
  }

}

export const MARK_DOWN_TOOLBAR = new InjectionToken<MarkdownToolbarComponent>('MARK_DOWN_TOOLBAR')

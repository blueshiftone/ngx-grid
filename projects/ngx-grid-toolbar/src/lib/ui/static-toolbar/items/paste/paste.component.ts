import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core'
import { distinctUntilChanged } from 'rxjs/operators'

import { PasteService } from '../../../../services/paste.service'
import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-paste',
  templateUrl: './paste.component.html',
  styleUrls: [
    './paste.component.scss',
    '../common-toolbar-item-styles.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasteComponent extends AutoUnsubscribe implements IToolbarComponent, OnInit {

  public readonly sortOrder: number = 6
  
  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Dropdown

  constructor(
    private readonly elRef         : ElementRef<HTMLElement>,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly toolbarService: ToolbarService,
    private readonly pasteService  : PasteService,
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.pasteService.state.pipe(distinctUntilChanged()).subscribe(_ => this.toolbarService.setItems()))
  }

  public get isVisible(): boolean {
    return !this.accessGranted || this.pasteService.hasClipboardContents === true
  }

  public get isEnabled(): boolean {
    return !this.accessGranted || this.toolbarService.recordCount > 0
  }

  public get element() { return this.elRef.nativeElement }

  public detectChanges(): void {
    this.changeDetector.detectChanges()
  }

  public async action(): Promise<void> {

    await this.pasteService.update(true)

    if (this.accessDenied) { this.pasteService.openDeniedDialog(); return }

    const clipboardContents = this.pasteService.clipboardContents
    const content           = await this.pasteService.getStringContent()
    if (!clipboardContents || !content) return

    this.toolbarService.gridController?.grid.GridPaste.run(content)  

  }

  private get _state() { return this.pasteService.state }
  
  public get accessGranted() { return this._state?.value === 'granted' || this._state?.value === 'grantedWithContent' }
  public get accessPending() { return this._state?.value === 'prompt' }
  public get accessDenied () { return this._state?.value === 'denied' }

}

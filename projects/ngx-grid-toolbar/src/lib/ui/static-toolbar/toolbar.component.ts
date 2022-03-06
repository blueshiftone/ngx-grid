import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { DataGridComponent } from '@blueshiftone/ngx-grid-core'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { LocalizationService } from '../../services/localization.service'
import { ToolbarService } from '../../toolbar.service'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { HasParentMatching } from '../../utils/dom-element-parent-traversal'
import { IsHTMLNode } from '../../utils/is-html-node'

@Component({
  selector: 'data-grid-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ToolbarService,
  ]
})
export class ToolbarComponent extends AutoUnsubscribe implements OnInit {

  @ViewChild('primary',          { static: true, read: ElementRef })       public primaryContainer!    : ElementRef
  @ViewChild('secondary',        { static: true, read: ElementRef })       public secondaryContainer!  : ElementRef
  @ViewChild('dropdown',         { static: true, read: ElementRef })       public dropdownContainer!   : ElementRef
  @ViewChild('dropDownTrigger',  { static: true, read: MatMenuTrigger })   public menuTrigger!         : MatMenuTrigger
  @ViewChild('dropdownMenu',     { static: true, read: ElementRef })       public dropdownMenu!        : ElementRef<HTMLElement>
  @ViewChild('itemFactory',      { static: true, read: ViewContainerRef }) public itemFactoryContainer!: ViewContainerRef

  @Input() public gridComponent?: DataGridComponent

  constructor(
    public readonly toolbarService : ToolbarService,
    public readonly changeDetection: ChangeDetectorRef,
    private readonly localizations: LocalizationService
  ) { super() }

  ngOnInit(): void {
    if (!this.gridComponent) return
    
    this._setLocalizations();
    this.gridComponent.localizations.changes.subscribe(_ => this._setLocalizations())

    this.toolbarService.gridController       = this.gridComponent.gridController
    this.toolbarService.multiCellEditService = this.gridComponent.multiEdit
    this.toolbarService.initialiseStaticToolbar(this.primaryContainer, this.secondaryContainer, this.dropdownContainer, this.itemFactoryContainer)
    this.addSubscription(this.gridComponent.selectionChanged.pipe(debounceTime(50)).subscribe(slice => this.toolbarService.selectionSlice.next(slice)))

    this.addSubscription(fromEvent<MouseEvent>(document.documentElement, 'mousedown').subscribe(e => {
      if (!IsHTMLNode(e.target as Node)) return
      const el = e.target as HTMLElement
      if (!HasParentMatching(this.dropdownMenu.nativeElement, el)) this.menuTrigger.closeMenu()
    }))

    this.addSubscription(fromEvent<MouseEvent>(this.dropdownContainer.nativeElement, 'mousedown').subscribe(e => {
      e.preventDefault()
      e.stopPropagation()
    }))
  }

  private _setLocalizations() {
    if (!this.gridComponent) return
    this.localizations.setLocalizations(this.gridComponent.localizations.getLocalizations())
    this.localizations.setCulture(this.gridComponent.localizations.culture)
    this.localizations.changes.next()
  }

  override appOnDestroy(): void {
    this.toolbarService.onDestroy()
  }

}

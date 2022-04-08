import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core'

import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-insert-record',
  templateUrl: './insert-record.component.html',
  styleUrls: [
    '../common-toolbar-item-styles.scss',
    './insert-record.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsertRecordComponent extends AutoUnsubscribe implements IToolbarComponent, OnInit {

  public readonly isEnabled: boolean               = true
  public readonly sortOrder: number                = 0
  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Primary

  constructor(
    private readonly elRef         : ElementRef<HTMLElement>,
    private readonly cd            : ChangeDetectorRef,
    private readonly toolbarService: ToolbarService
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.toolbarService.selectionSlice.subscribe(_ => this.cd.detectChanges()))
  }

  public get isVisible(): boolean { return this.toolbarService.gridController?.dataSource.canInsert !== false }
  
  public get element() { return this.elRef.nativeElement }

  public detectChanges(): void {
    this.cd.detectChanges()
  }

  public get hasSelection(): boolean {
    return this.toolbarService.selectionSlice.value !== null && this.toolbarService.selectionSlice.value.rowKeys.length > 0
  }

  public insertAtTop(): void {
    this.toolbarService.gridController?.row.InsertRowAtTop.run()
  }

  public insertAboveSelection(): void {
    this.toolbarService.gridController?.row.InsertRowAboveSelection.run()
  }

  public insertBelowSelection(): void {
    this.toolbarService.gridController?.row.InsertRowBelowSelection.run()
  }

  public insertAtBottom(): void {
    this.toolbarService.gridController?.row.InsertRowAtBottom.run()
  }

}

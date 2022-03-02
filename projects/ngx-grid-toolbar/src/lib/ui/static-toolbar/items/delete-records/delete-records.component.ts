import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core'
import { TPrimaryKey } from '@blueshiftone/ngx-grid-core'

import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-delete-selection',
  templateUrl: './delete-records.component.html',
  styleUrls: [
    './delete-records.component.scss',
    '../common-toolbar-item-styles.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteRecordsComponent extends AutoUnsubscribe implements IToolbarComponent {

  public readonly sortOrder: number = 10

  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Dropdown

  constructor(
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
    public  readonly toolbarService : ToolbarService,
  ) { super() }

  public get isVisible(): boolean { return this.toolbarService.gridController?.grid.source()?.canDelete !== false }

  public get isEnabled(): boolean {
    return this.toolbarService.recordCount > 0
  }

  public get element() { return this.elRef.nativeElement }

  public detectChanges(): void {
    this.changeDetection.detectChanges()
  }

  public action(): void {
    this._selectedRowKeys.forEach(k => {
      this.toolbarService.gridController?.row.DeleteRow.buffer(k)
    })
  }

  private get _selectedRowKeys(): TPrimaryKey[] {
    return this.toolbarService.selectionSlice.value?.rowKeys ?? []
  }

}

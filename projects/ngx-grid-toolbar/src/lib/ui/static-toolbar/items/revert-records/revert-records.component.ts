import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core'

import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-revert-records',
  templateUrl: './revert-records.component.html',
  styleUrls: [
    '../common-toolbar-item-styles.scss',
    './revert-records.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RevertRecordsComponent extends AutoUnsubscribe implements IToolbarComponent, OnInit {
  
  public readonly isEnabled: boolean = true
  public readonly sortOrder: number = 2
  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Primary

  constructor(
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
    public  readonly toolbarService : ToolbarService
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.toolbarService.selectionSlice.subscribe(_ => this.changeDetection.detectChanges()))
  }

  public get isVisible(): boolean {
    return (this.toolbarService.gridController?.row.dirtyRowsMap.size ?? 0) > 0
  }

  public get element() { return this.elRef.nativeElement }

  public detectChanges = () => this.changeDetection.detectChanges()

  public get selectionDirtyRecordsCount(): number {
    const meta = this.toolbarService.currentMeta
    return meta.rows.filter(row => row.isDirty).length
  }

  public revertSelected = () => this.toolbarService.gridController?.grid.RevertSelected.run()
  public revertAll      = () => this.toolbarService.gridController?.grid.RevertAll.run()

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core'
import { IGridCellValue } from '@blueshiftone/ngx-grid-core'

import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-commit-records',
  templateUrl: './commit-records.component.html',
  styleUrls: [
    '../common-toolbar-item-styles.scss',
    './commit-records.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommitRecordsComponent extends AutoUnsubscribe implements IToolbarComponent, OnInit {
  
  public readonly isEnabled: boolean               = true
  public readonly sortOrder: number                = 1
  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Primary

  constructor(
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
    public  readonly toolbarService : ToolbarService
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.toolbarService.selectionSlice.subscribe(_ => this.changeDetection.detectChanges()))
  }

  public get hasInvalidValues(): boolean {
    const controller = this.toolbarService.gridController
    if (!controller) return false
    const meta = controller.cell.GetAllCellMetaForDirtyRows.run() ?? []
    const values = meta.map(m => controller.cell.GetCellValue.run(m.coords)).filter(c => c) as IGridCellValue[]
    return typeof values.find(val => val.validationState?.nextIsValid === false) !== 'undefined'
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

  public commitSelected = () => this.toolbarService.gridController?.grid.CommitSelected.run()
  public commitAll      = () => this.toolbarService.gridController?.grid.CommitAll.run()

}

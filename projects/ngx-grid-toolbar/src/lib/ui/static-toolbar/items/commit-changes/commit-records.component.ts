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
  
  public isEnabled: boolean = true
  public readonly sortOrder: number = 1
  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Primary

  constructor(
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
    public  readonly toolbarService : ToolbarService
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.toolbarService.selectionSlice.subscribe(_ => this.changeDetection.detectChanges()))
    this.addSubscription(this.toolbarService.isCommitEnabled.subscribe(v => {
      this.isEnabled = v
      this.changeDetection.detectChanges()
    }))
  }

  public get hasInvalidValues(): boolean {
    const controller = this.toolbarService.gridController
    if (!controller) return false
    const meta = controller.cell.GetAllCellMetaForDirtyRows.run() ?? []
    const values = meta.map(m => controller.cell.GetCellValue.run(m.coords)).filter(c => c) as IGridCellValue[]
    return values.find(val => val.validationState?.nextIsValid === false && val.validationState.validationResults.find(v => v.nonBlocking !== true) !== undefined) !== undefined
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

  public commitSelected = () => this.toolbarService.gridController?.grid.CommitSelected.run({ dryRun: true })
  public commitAll      = () => this.toolbarService.gridController?.grid.CommitAll.run({ dryRun: true })

}

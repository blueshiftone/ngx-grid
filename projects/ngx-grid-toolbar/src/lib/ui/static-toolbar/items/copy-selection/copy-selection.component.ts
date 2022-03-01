import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core'

import { ToolbarService } from '../../../../toolbar.service'
import { EToolbarItemPlacement } from '../../../../typings/enums/toolbar-item-placement.enum'
import { IToolbarComponent } from '../../../../typings/interfaces/toolbar-component.interface'
import { AutoUnsubscribe } from '../../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-toolbar-copy-selection',
  templateUrl: './copy-selection.component.html',
  styleUrls: [
    './copy-selection.component.scss',
    '../common-toolbar-item-styles.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopySelectionComponent extends AutoUnsubscribe implements IToolbarComponent {

  public readonly sortOrder: number = 5

  public readonly placement: EToolbarItemPlacement = EToolbarItemPlacement.Dropdown

  constructor(
    private readonly elRef          : ElementRef<HTMLElement>,
    private readonly changeDetection: ChangeDetectorRef,
    public  readonly toolbarService : ToolbarService,
  ) { super() }

  public get isVisible() { return true }

  public get isEnabled(): boolean { return this.toolbarService.cellCount > 0 }

  public get element() { return this.elRef.nativeElement }

  public detectChanges(): void {
    this.changeDetection.detectChanges()
  }

  public action(): void {
    this.toolbarService.gridController?.selection.copySelection()
  }

}

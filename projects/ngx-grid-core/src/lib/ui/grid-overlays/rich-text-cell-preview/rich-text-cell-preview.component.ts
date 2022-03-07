import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EPositionPreference } from '../../../typings/enums/position-preference.enum'
import { IGridExpandableCellData, IGridOverlayData } from '../../../typings/interfaces'
import { BasePreviewComponent } from '../base-grid-preview-overlay.component'
import { EGridOverlayTypes } from '../grid-overlay-types'

@Component({
  selector: 'data-grid-rich-text-cell-preview',
  templateUrl: './rich-text-cell-preview.component.html',
  styleUrls: ['./rich-text-cell-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextCellPreviewComponent extends BasePreviewComponent implements OnInit {

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData<IGridExpandableCellData>,
    public  override readonly cd                   : ChangeDetectorRef,
    private readonly elRef                         : ElementRef<HTMLElement>
  ) { super(data, cd) }

  private _isOpen = false

  public async expand(): Promise<void> {

    if (this._isOpen) return

    this._isOpen = true

    const output = this.data.overlayService.open(this.data.currentCell, EGridOverlayTypes.MarkdownEditor, {
      flexibleDimensions: true,
      positionPreference: EPositionPreference.VerticalBottom,
      referenceElement: this.elRef.nativeElement,
    })

    await output.afterClosed

    this._isOpen = false

  }

}

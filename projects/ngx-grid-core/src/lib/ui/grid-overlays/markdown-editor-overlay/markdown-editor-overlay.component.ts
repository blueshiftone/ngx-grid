import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { IGridOverlayData } from '../../../typings/interfaces'
import { BaseOverlayComponent } from '../base-grid-overlay.component'

@Component({
  selector: 'data-grid-markdown-editor-overlay',
  templateUrl: './markdown-editor-overlay.component.html',
  styleUrls: ['./markdown-editor-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkdownEditorComponent extends BaseOverlayComponent {

  constructor(
    @Inject(GRID_OVERLAY_DATA) public override data: IGridOverlayData,
    public override cd: ChangeDetectorRef,
  ) { super(data, cd) }

}

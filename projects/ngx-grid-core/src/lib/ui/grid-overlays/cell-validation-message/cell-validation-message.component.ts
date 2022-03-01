import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { EValidationSeverity, IGridOverlayData, IGridValueValidationResult } from '../../../typings/interfaces'

@Component({
  selector: 'data-grid-cell-validation-message',
  templateUrl: './cell-validation-message.component.html',
  styleUrls: ['./cell-validation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellValidationMessageComponent {

  public validationResults: IGridValueValidationResult[]

  @HostBinding('class') private _hostClass: string;

  constructor(
    @Inject(GRID_OVERLAY_DATA) public data: IGridOverlayData<IGridValueValidationResult[]>,
  ) {
    this.validationResults = data.customData
    this._hostClass = `${EValidationSeverity[Math.min(...this.validationResults.map(x => x.severity))]} mat-elevation-z2`
  }

  public severity(result: IGridValueValidationResult) {
    return EValidationSeverity[result.severity]
  }

}

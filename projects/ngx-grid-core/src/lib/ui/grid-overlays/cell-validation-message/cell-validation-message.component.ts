import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject } from '@angular/core'

import { GRID_OVERLAY_DATA } from '../../../services/grid-overlay-service.service'
import { LocalizationService } from '../../../services/localization.service'
import { EValidationSeverity, IGridOverlayData, IGridValueValidationResult } from '../../../typings/interfaces'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-cell-validation-message',
  templateUrl: './cell-validation-message.component.html',
  styleUrls: ['./cell-validation-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellValidationMessageComponent extends AutoUnsubscribe {

  public validationResults: IGridValueValidationResult[]

  @HostBinding('class') private _hostClass: string;

  constructor(
    @Inject(GRID_OVERLAY_DATA) public data: IGridOverlayData<IGridValueValidationResult[]>,
    private loc: LocalizationService,
    private cd: ChangeDetectorRef
  ) {
    super()
    this.validationResults = data.customData
    this._hostClass = `${EValidationSeverity[Math.min(...this.validationResults.map(x => x.severity))]} mat-elevation-z2`
    this.addSubscription(this.loc.changes.subscribe(_ => this.cd.detectChanges()))
  }

  public severity(result: IGridValueValidationResult) {
    return EValidationSeverity[result.severity]
  }

  public localized(str: string) {
    return this.loc.getLocalizedString(str)
  }

}

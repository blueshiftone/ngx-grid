import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { TGridUITheme } from '../../typings/interfaces'

@Component({
  selector: 'data-grid-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipComponent implements OnInit {

  @Input() public chipStyle: 'rounded' | 'square' = 'square'
  @Input() public editable: boolean = true
  @Input() public label?: string
  @Input() public color?: string
  @Input() public theme?: TGridUITheme

  @Output() public removeAction = new EventEmitter<void>()
  @Output() public clickAction = new EventEmitter<void>()

  constructor() { }

  ngOnInit(): void {
  }

  public get hasClickObservers(): boolean {
    return this.clickAction.observed
}

}

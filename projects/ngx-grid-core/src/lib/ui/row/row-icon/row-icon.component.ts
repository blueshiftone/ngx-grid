import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { EGridIcon } from '../../../services/icon.service'

@Component({
  selector: 'data-grid-row-icon',
  templateUrl: './row-icon.component.html',
  styleUrls: ['./row-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowIconComponent implements OnInit {

  @Input() public icon!: BehaviorSubject<EGridIcon | null>

  constructor(private readonly cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.icon.subscribe(_ => this.cd.detectChanges())
  }

  public get iconValue(): string {
    if (!this.icon || this.icon.value === null) return ''
    const icon = this.icon.value as EGridIcon
    return Object.keys(EGridIcon)[Object.values(EGridIcon).indexOf(icon)]
  }

}

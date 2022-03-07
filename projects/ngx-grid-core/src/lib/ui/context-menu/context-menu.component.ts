import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'

import { EGridIcon } from '../../services/icon.service'
import { IGridContextMenu } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent extends AutoUnsubscribe implements OnInit {

  @Input() public menu!: IGridContextMenu

  constructor(
    private readonly cd: ChangeDetectorRef
  ) { super() }

  ngOnInit(): void {
    this.addSubscription(this.menu.loc.changes.subscribe(_ => this.cd.detectChanges()))
  }

  public iconValue(value: EGridIcon) {
    return Object.keys(EGridIcon)[Object.values(EGridIcon).indexOf(value)]
  }

  public localize(str: string): string {
    return this.menu.loc.getLocalizedString(str)
  }

}

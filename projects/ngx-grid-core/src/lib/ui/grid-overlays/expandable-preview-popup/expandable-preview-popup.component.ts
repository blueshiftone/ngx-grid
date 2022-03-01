import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { from } from 'rxjs'
import { filter } from 'rxjs/operators'

import { IGridExpandableCellData } from '../../../typings/interfaces/grid-expandable-cell-data.interface'
import { IGridOverlayData } from '../../../typings/interfaces/grid-overlay-data.interface'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-expandable-preview-popup',
  templateUrl: './expandable-preview-popup.component.html',
  styleUrls: ['./expandable-preview-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandablePreviewPopupComponent extends AutoUnsubscribe implements OnInit {

  @Output() public action = new EventEmitter<'expandButton' | 'cellOpen'>()
  @Input() public overlayData?: IGridOverlayData<IGridExpandableCellData>

  public backgroundColor = ''

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) { super() }

  ngOnInit(): void {
    if (!this.overlayData) return

    const disablePointerEvents = (el: HTMLElement) => {
      el.style.pointerEvents = 'none'
      if (el.classList.contains('cdk-overlay-pane') || !el.parentElement) return
      disablePointerEvents(el.parentElement)
    }
    disablePointerEvents(this.elRef.nativeElement)

    from(this.elRef.nativeElement.childNodes)
      .pipe(filter(e => e.nodeType === 1))
      .forEach(el => (el as HTMLElement).style.pointerEvents = 'auto')

    this.backgroundColor = this.overlayData.customData.backgroundColor ?? ''
    this.addSubscription(this.overlayData.customData.expandTrigger.subscribe(_ => {
      this.action.emit('cellOpen')
    }))
  }

}

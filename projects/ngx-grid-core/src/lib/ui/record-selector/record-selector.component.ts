import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { merge, Subject } from 'rxjs'

import { LIST_ANIMATION } from '../../animations/list.animation'
import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { GridDataSource } from '../../grid-data-source'
import { GridOverlayService } from '../../services/grid-overlay-service.service'
import { IGridDataSource, IGridRow } from '../../typings/interfaces'
import { IGridRecordSelectedEvent } from '../../typings/interfaces/grid-record-selected-event.interface'
import { TPrimaryKey } from '../../typings/types'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-record-selector',
  templateUrl: './record-selector.component.html',
  styleUrls: ['./record-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    GridControllerService,
    GridEventsService,
    GridOverlayService,
  ],
  animations: [LIST_ANIMATION]
})
export class RecordSelectorComponent extends AutoUnsubscribe implements OnInit, OnChanges {

  @ViewChild('viewport', { static: true }) public viewportComponent!: CdkVirtualScrollViewport

  @Input() public source: IGridDataSource     = new GridDataSource()
  @Input() public icon: string                = 'add'
  @Input() public selectedRows: TPrimaryKey[] = []

  @Output() public selected = new EventEmitter<IGridRecordSelectedEvent>()

  public get rows() { return this.gridController.dataSource.rows.output }

  private _sourceChanged = new  Subject<void>()

  constructor(
    public readonly gridController: GridControllerService,
    public readonly events        : GridEventsService,
    public readonly cd            : ChangeDetectorRef
  ) { super() }

  ngOnInit(): void {
    
    this.addSubscription(merge(
      this.events.factory.GridDataChangedEvent.onWithInitialValue(),
      this.events.factory.ColumnSortByChangedEvent.on(),
      this._sourceChanged
    ).subscribe(_ => {
      this.cd.detectChanges()
      this.gridController.row.RowComponents.getAll().forEach(r => r.detectChanges())
    }))

    this.addSubscription(this.events.factory.GridDataChangedEvent.on().subscribe(_ => {
      window.requestAnimationFrame(_ => this.viewportComponent.checkViewportSize())
    }))

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this._hasChange('source', changes) && this.source !== this.gridController.dataSource) {
      this.gridController.grid.SetDataSource.run(changes['source'].currentValue)
      this._sourceChanged.next()
    }
  }

  public override appOnDestroy(): void {
    this.gridController.onDestroy()
  }

  public rowTrackBy = (index: number, row: IGridRow) => row.rowKey

  private _hasChange(key: string, changes: SimpleChanges) {
    return changes[key] && changes[key].previousValue !== changes[key].currentValue
  }

}

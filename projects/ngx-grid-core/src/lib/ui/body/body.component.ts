import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core'
import { concat, interval } from 'rxjs'
import { distinctUntilChanged, map, startWith, switchMap, take } from 'rxjs/operators'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { GridContextMenuService } from '../../services/grid-context-menu.service'
import { IGridRow, IGridViewportAutoScrollConfigs } from '../../typings/interfaces'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'

@Component({
  selector: 'data-grid-body',
  templateUrl: './body.component.html',
  styleUrls: [
    '../../data-grid-common-styles.scss',
    './body.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyComponent extends AutoUnsubscribe implements OnInit {

  @Input() public name?: string

  @ViewChild('viewport', { static: true }) public viewPort!: CdkVirtualScrollViewport

  public rows: IGridRow[] = []

  public dataChanges = this.events.factory.GridDataChangedEvent.on()

  private readonly autoScrollConfigs: IGridViewportAutoScrollConfigs = {
    triggerAreaSize: 60,
    scrollFactor   : 50,
    scrollRampUp   : concat(
      interval(1)  .pipe(take(1)),
      interval(300).pipe(take(1)),
      interval(200).pipe(take(2)),
      interval(100).pipe(take(5)),
      interval(50) .pipe(take(10)),
      interval(25) .pipe(take(20)),
      interval(10) .pipe(),
    )
  }

  constructor(
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly cd            : ChangeDetectorRef,
    private readonly contextMenu   : GridContextMenuService,
  ) { super() }

  ngOnInit(): void {

    const dataSourceChanges = this.events.factory.GridDataChangedEvent.on().pipe(distinctUntilChanged())

    let isFirstRows = true

    this.addSubscription(dataSourceChanges
      .pipe(startWith(this.gridController.dataSource), switchMap(source => source.rows.output))
      .subscribe(rows => {
          if (isFirstRows && rows.length) {
            // if this is the first time we've seen rows
            // then reset column widths so they can be re-measured
            this.gridController.column.InitialiseColumnWidth.reset()
            isFirstRows = false
          }
          
          this.rows = rows
          this.cd.detectChanges()}))

    this.gridController.grid.attachViewport(this.viewPort, this.autoScrollConfigs)
    this.gridController.selection.attachGridBody(this.viewPort)

    this.addSubscription(this.gridController.dataSource.rows.output.pipe(
      map(rows => rows[0]?.floatingTitle?.isGroup === true),
      distinctUntilChanged()).subscribe(hasGroups => this.viewPort.elementRef.nativeElement.classList.toggle('has-groups', hasGroups)))

  }

  public rowTrackBy = (_: number, row: IGridRow) => row.rowKey

  public getContextMenuItems = () => this.contextMenu.getSelectionContextMenuItems()

  public get underlyingRowCount() {
    return this.gridController.dataSource.rows.firstValue.length
  }

}

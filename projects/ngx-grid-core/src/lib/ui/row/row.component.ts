import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { EGridIcon } from '../../services/icon.service'
import { IGridCellCoordinates, IGridColumn, IGridRow, IGridRowComponent, IGridSeparator } from '../../typings/interfaces'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { CellComponent } from '../cell/cell.component'

@Component({
  selector: 'data-grid-row',
  templateUrl: './row.component.html',
  styleUrls: [
    '../../data-grid-common-styles.scss',
    './row.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent extends AutoUnsubscribe implements OnInit, OnChanges, IGridRowComponent {

  @ViewChildren('cells', { read: CellComponent }) public cells?: QueryList<CellComponent>
  
  @Input() public gridRow!: IGridRow
  @Input() public index   : number = 0

  public columns      :IGridColumn[] = []
  public isFocused    : boolean      = false
  public selectedCells: boolean[]    = []
  public icon                        = new BehaviorSubject<EGridIcon | null>(null)

  constructor(
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>
  ) {
    super()
  }

  ngOnInit(): void {
    this._setColumns()
  }

  override appOnDestroy(): void {
    this.gridController.row.RowComponents.removed(this)
  }

  ngOnChanges(changes: SimpleChanges) {
    const oldKey = changes['gridRow']?.previousValue?.rowKey
    if (oldKey) this.gridController.row.RowComponents.changed(this, oldKey, this.cells?.toArray() ?? [])
    else        this.gridController.row.RowComponents.added(this)
    this.cells?.forEach(c => c.detectChanges())
  }

  @HostListener('mouseenter')
  public mouseEntered  = () => this.events.factory.RowMouseEnteredEvent.emit(this)
  
  public indexOf       = (columnKey: string) => { return this.columns.findIndex(c => c.columnKey === columnKey) }
  public cellColumnKey = (i: number) => this.columns[i]
  public toggleClass   = (className: string, on: boolean) => this.elRef.nativeElement.classList.toggle(className, on)
  public detectChanges = () => {
    this._setColumns()
    this.cd.detectChanges()
  }
  
  public get rowKey()           : TPrimaryKey          { return this.gridRow.rowKey }
  public get separators()       : IGridSeparator[]     { return this.gridController.row.GetRowSeparators.run(this.rowKey) }
  public get firstCellPosition(): IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columns[0].columnKey) }
  public get lastCellPosition() : IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columns[this.columns.length-1].columnKey) }
  public get rowComponent()     : IGridRowComponent    { return this }
  public get element()          : HTMLElement          { return this.elRef.nativeElement }

  private _setColumns(): void {
    this.columns.length = 0
    this.columns.push(...this.gridController.dataSource.columns)
  }

}

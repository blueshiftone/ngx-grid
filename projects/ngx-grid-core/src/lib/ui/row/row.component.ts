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
import { MatIconRegistry } from '@angular/material/icon'
import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { EGridIcon } from '../../services/icon.service'
import { LocalizationService } from '../../services/localization.service'
import { EMetadataType } from '../../typings/enums'
import { IGridCellCoordinates, IGridColumn, IGridRow, IGridRowComponent, IGridRowFloatingTitle, IGridSeparator } from '../../typings/interfaces'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TPrimaryKey } from '../../typings/types'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { CellComponent } from '../cell/cell.component'
import { RowFloatingTitleTSComponent } from './row-floating-title/row-floating-title.ts-component'

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

  private _floatingTitle: IGridRowFloatingTitle | null = null
  private _floatingTitleComponent?: RowFloatingTitleTSComponent

  private _lastSeenNestedLevel?: number

  public get gridHasGroups() {
    // we're making an assumption here that if the first row is a group header, then the grid has groups
    return this.gridController.dataSource.rows.latestValue[0]?.floatingTitle?.isGroup === true
  }

  public get isLeafRow() { 
    return this.gridHasGroups && this.gridRow.floatingTitle === null
  }

  public get isLastInGroup() {
    return this.isLeafRow && this.gridController.dataSource.rows.latestValue[this.index+1]?.floatingTitle !== null
  }

  public get isFirstInGroup() {
    return this.isLeafRow && this.gridController.dataSource.rows.latestValue[this.index-1]?.floatingTitle !== null
  }

  constructor(
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly cd            : ChangeDetectorRef,
    private readonly elRef         : ElementRef<HTMLElement>,
    private readonly loc           : LocalizationService,
    private readonly iconRegistry  : MatIconRegistry,
  ) {
    super()
  }

  public localize(key: string) {
    return this.loc.getLocalizedString(key)
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
    
    const nestedLevel = this.gridRow.metadata.get<number>(EMetadataType.NestingLevel) ?? this.gridController.dataSource.leafLevel
    
    if (this._lastSeenNestedLevel !== nestedLevel) {
      this._lastSeenNestedLevel = nestedLevel
      // remove classes starting with 'level-'
      const classes = this.element.classList
      for (let i = 0; i < classes.length; i++) {
        if (classes[i].startsWith('level-')) {
          classes.remove(classes[i])
          i--
        }
      }
      this.element.classList.add(`level-${nestedLevel}`)
    }
    
    // Manage the floating title component
    if (this.gridRow.floatingTitle !== this._floatingTitle) {
      this._floatingTitle = this.gridRow.floatingTitle
      if (this._floatingTitle === null) {
        // destroy the component
        if (this._floatingTitleComponent) {
          this._floatingTitleComponent.destroy()
          this._floatingTitleComponent = undefined
        }
      } else {
        // create the component if it doesn't exist
        if (!this._floatingTitleComponent) {
          this._floatingTitleComponent = new RowFloatingTitleTSComponent(this._floatingTitle, this.iconRegistry)
          this._floatingTitleComponent.attachTo(this.element)
        } else {
          // update the component
          this._floatingTitleComponent.next(this._floatingTitle)
        }
      }
    }

    this.element.classList.toggle('title-row', this.gridRow.floatingTitle !== null)
  }

  @HostListener('mouseenter')
  public mouseEntered  = () => this.events.factory.RowMouseEnteredEvent.emit(this)

  @HostListener('dblclick')
  public dblClick = () => this.events.factory.RowDoubleClickedEvent.emit(this)
  
  public indexOf       = (columnKey: string) => { return this.columns.findIndex(c => c.columnKey === columnKey) }
  public cellColumnKey = (i: number) => this.columns[i]
  public toggleClass   = (className: string, on: boolean) => this.elRef.nativeElement.classList.toggle(className, on)
  public detectChanges = () => {
    this.cells?.forEach(c => c.detectChanges())
    this._setColumns()
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
    this.cd.detectChanges()
  }

}

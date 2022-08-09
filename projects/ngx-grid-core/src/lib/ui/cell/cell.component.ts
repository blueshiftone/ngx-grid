import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

import { GridControllerService } from '../../controller/grid-controller.service'
import { GridEventsService } from '../../events/grid-events.service'
import { GridOverlayService } from '../../services/grid-overlay-service.service'
import { IGridCellComponent, IGridCellCoordinates, IGridCellType, IGridDataType, IGridRowComponent } from '../../typings/interfaces'
import { GridCellCoordinates } from '../../typings/interfaces/implementations'
import { TColumnKey, TPrimaryKey } from '../../typings/types'
import { AutoUnsubscribe } from '../../utils/auto-unsubscribe'
import { TO_KEBAB } from '../../utils/string-converter'
import CELL_TYPES from './cell-types'

@Component({
  selector       : 'data-grid-cell',
  templateUrl    : './cell.component.html',
  styleUrls      : ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent extends AutoUnsubscribe implements OnInit, AfterViewChecked, IGridCellComponent {

  public focus     = new BehaviorSubject<any>(false)
  public destroyed = new Subject<void>()
  public typeComponent?: IGridCellType

  private _lastSeenType?: IGridDataType

  @HostListener('mouseenter')
  public mouseEnter = () => this.events.factory.CellMouseEnteredEvent.emit(this)

  @Input() public rowComponent!: IGridRowComponent

  @Input() public columnKey! : TColumnKey

  constructor(
    public  readonly overlays      : GridOverlayService,
    private readonly gridController: GridControllerService,
    private readonly events        : GridEventsService,
    private readonly elRef         : ElementRef<HTMLElement>,
  ) {
    super()
  }

  ngOnInit(): void {
    this.gridController.cell.CellComponents.added(this)
    if (this.gridController.isInitialised) this.gridController.cell.SetCellWidth.run(this)
    this.renderCellType()
  }

  ngAfterViewChecked(): void {
    if (!this.gridController.isInitialised) {
      window.requestAnimationFrame(_ => {
        this.gridController.column.InitialiseColumnWidth.values.next({ columnKey: this.columnKey, width: this.element.getBoundingClientRect().width })
      })
    }
  }

  override appOnDestroy(): void {
    this.gridController.cell.CellComponents.removed(this)
    this.typeComponent?.onDestroy()
    this.destroyed.next()
  }

  public renderCellType(firstTime = false): void {
    const cellType = this.type
    if (this._lastSeenType?.name !== cellType.name || firstTime) {
      this.typeComponent?.onDestroy()
      this.typeComponent = new CELL_TYPES[cellType.name](this.gridController, this.overlays, this).initializeValue(this._getValue()).attachTo(this.element)
    }
    if (typeof this.rowComponent.gridRow.getValue(this.columnKey)?.validationState === 'undefined') {
      this.gridController.cell.ValidateCell.run(this.coordinates)
    }
    this._setCellTypeClass(TO_KEBAB(cellType.name))
    this._lastSeenType = cellType
  }

  public detectChanges = () => this.typeComponent?.receiveValue(this._getValue())

  public setValue    = (value: any)             => this.typeComponent?.receiveValue(value)  
  public startEdit   = ()                       => this.typeComponent?.open()
  public stopEdit    = ()                       => this.typeComponent?.close()
  public toggleClass = (c: string, on: boolean) => this.element.classList.toggle(c, on)

  public get rowKey     (): TPrimaryKey          { return this.rowComponent.rowKey }
  public get element    (): HTMLElement          { return this.elRef.nativeElement }
  public get coordinates(): IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columnKey)}
  public get style      (): CSSStyleDeclaration  { return this.element.style }
  public get type       (): IGridDataType        { return this.gridController.cell.GetCellType.run(this.coordinates) }

  private _setCellTypeClass(newClass: string): void {
    if (this._lastSeenType) this.toggleClass(this._lastSeenType?.name, false)
    this.toggleClass(newClass, true)
  }

  private _getValue() {
    return  this.gridController.cell.GetCellValue.run(this.coordinates)?.value
  }

}

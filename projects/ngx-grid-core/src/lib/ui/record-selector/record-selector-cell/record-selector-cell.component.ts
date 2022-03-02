import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { GridOverlayService } from '../../../services/grid-overlay-service.service'
import { IGridCellComponent, IGridCellCoordinates, IGridCellType, IGridDataType, IGridRowComponent } from '../../../typings/interfaces'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { TColumnKey, TPrimaryKey } from '../../../typings/types'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'
import { TO_KEBAB } from '../../../utils/string-converter'
import CELL_TYPES from '../../cell/cell-types'

@Component({
  selector: 'data-grid-record-selector-cell',
  templateUrl: './record-selector-cell.component.html',
  styleUrls: [
    '../../cell/cell.component.scss',
    './record-selector-cell.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordSelectorCellComponent extends AutoUnsubscribe implements IGridCellComponent, OnChanges, OnInit {

  @ViewChild('CellValueElement', {static: true}) public cellValueElement!: ElementRef<HTMLDivElement>

  @Input() public columnKey: TColumnKey = ''
  @Input() public rowComponent!: IGridRowComponent

  public focus                         = new BehaviorSubject<any>(false)
  public destroyed                     = new Subject<void>()
  public typeComponent?: IGridCellType

  private _lastSeenType?: IGridDataType

  constructor(
    private readonly gridController: GridControllerService,
    public  readonly overlays      : GridOverlayService
  ) { super() }

  ngOnInit(): void {
    this.renderCellType()
  }

  ngOnChanges(): void {
    this.detectChanges()
  }

  public detectChanges() {
    const newValue = this._getValue()
    if (newValue !== this.typeComponent?.value) this.setValue(newValue)
  }

  public renderCellType(): void {
    if (this._lastSeenType?.name !== this.type.name) {
      if (this.typeComponent) this.typeComponent.onDestroy()
      this.typeComponent = new CELL_TYPES[this.type.name](this.gridController, this.overlays, this).initializeValue(this._getValue()).attachTo(this.element)
    }
    this._setCellTypeClass(TO_KEBAB(this.type.name))
    this._lastSeenType = this.type
  }

  public setValue    = (value: any)                =>  this.typeComponent?.receiveValue(value) 
  public toggleClass = (c: string, state: boolean) => this.element.classList.toggle(c, state)
  public startEdit   = ()                          => {}
  public stopEdit    = ()                          => {}

  public get element     (): HTMLElement          { return this.cellValueElement.nativeElement }
  public get rowKey      (): TPrimaryKey          { return this.rowComponent.rowKey }
  public get coordinates (): IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columnKey) }
  public get style       (): CSSStyleDeclaration  { return this.element.style }
  public get type        (): IGridDataType        { return this.gridController.cell.GetCellType.run(this.coordinates) }
  public get label       (): string               { return this.gridController.column.GetColumnLabel.run(this.columnKey) }

  private _setCellTypeClass(newClass: string): void {
    if (this._lastSeenType) this.toggleClass(this._lastSeenType?.name, false)
    this.toggleClass(newClass, true)
  }

  private _getValue(): any {
    return this.gridController.cell.GetCellValue.run(this.coordinates)?.value
  }

}

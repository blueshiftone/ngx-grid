import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { GridControllerService } from '../../../controller/grid-controller.service'
import { EGridIcon } from '../../../services/icon.service'
import { IGridCellCoordinates, IGridColumn, IGridRow, IGridRowComponent } from '../../../typings/interfaces'
import { IGridRecordSelectedEvent } from '../../../typings/interfaces/grid-record-selected-event.interface'
import { GridCellCoordinates } from '../../../typings/interfaces/implementations'
import { GridImplementationFactory } from '../../../typings/interfaces/implementations/grid-implementation.factory'
import { TPrimaryKey } from '../../../typings/types'
import { AutoUnsubscribe } from '../../../utils/auto-unsubscribe'
import { RecordSelectorCellComponent } from '../record-selector-cell/record-selector-cell.component'

@Component({
  selector: 'data-grid-record-selector-row',
  templateUrl: './record-selector-row.component.html',
  styleUrls: ['./record-selector-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordSelectorRowComponent extends AutoUnsubscribe implements IGridRowComponent, OnInit, OnChanges {

  @ViewChildren('cells') public cells?: QueryList<RecordSelectorCellComponent>

  @Input() public index  : number      = -1
  @Input() public gridRow: IGridRow    = GridImplementationFactory.gridRow('', new Map())
  @Input() public rowKey : TPrimaryKey = ''
  @Input() public iconStr: string      = 'add'

  @Output() public selected = new EventEmitter<IGridRecordSelectedEvent>()

  public columns: IGridColumn[] = []
  public icon                  = new BehaviorSubject<EGridIcon | null>(null)
  public rowComponent          = this

  @HostListener('click')
  public onClick() {
    this.selected.emit({
      originatedFrom: 'RecordRow',
      rowKey : this.rowKey
    })
  }

  constructor(
    public  readonly elRef         : ElementRef<HTMLElement>,
    public  readonly cd            : ChangeDetectorRef,
    private readonly gridController: GridControllerService,
  ) { super() }

  ngOnInit(): void {
    this._setColumns()
  }

  ngOnChanges(): void {
    this._setColumns()
    this.cells?.forEach(cell => {
      cell.detectChanges()
    })
  }

  public get firstCellPosition(): IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columns[0].columnKey) }
  public get lastCellPosition() : IGridCellCoordinates { return new GridCellCoordinates(this.rowKey, this.columns[this.columns.length-1].columnKey) }
  
  public get element() { return this.elRef.nativeElement }

  public get previewDescription() {
    return this.gridController.row.GetRowPreviewString.run(this.rowKey)
  }

  public get disabled() {
    return this.gridController.grid.GetIsDisabled.run()
  }

  public toggleClass = (className: string, classState: boolean) => this.element.classList.toggle(className, classState)

  public detectChanges = () => {
    this._setColumns()
    this.cd.detectChanges()
  }

  public cellColumnKey = (i: number) => this.columns[i]
  
  private _setColumns(): void {
    this.columns.length = 0
    this.columns.push(...this.gridController.dataSource.columns)
  }

}
